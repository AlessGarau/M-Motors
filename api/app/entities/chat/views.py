from rest_framework import viewsets, permissions
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings

from ai.app.modules.options import Options
from ai.app.modules.s3 import FileStorage
from ai.app.models.llm import BaseLLMApplication, LLMFactory
from ai.app.models.rag import RAGApplication
from ai.app.models.prompt import rag_prompt, base_prompt
from rest_framework.decorators import action
from app.entities.contract.models import Contract

def create_vector_store(docs):
    embeddings = OllamaEmbeddings(model='llama3.2:1B')
    # doc_vectors = [embeddings.embed_query(doc.page_content) for doc in docs]

    vector_store = FAISS.from_documents(
        docs,
        embedding=embeddings
    )

    return vector_store


class ChatViewSet(viewsets.GenericViewSet):
    permission_classes=[permissions.AllowAny]

    @action(detail=False, methods=["post"], url_path="ask")
    def ask_question(self, request):
        """
        Receive text from the frontend in the request body.
        
        Expected request body format:
        {
            "text": "message content here"
        }
        """
        prompt = request.data.get('message')
        
        BUCKET_NAME = "contracts"

        files = Contract.objects.filter(user=self.request.user)
        print(files)
        if not files:
            return Response({"message": "Aucun fichier dans le Bucket. Fin du processus", "received_text": prompt}, status=status.HTTP_200_OK)

        selected_file = files[0]

        docs = FileStorage.process_pdf_file(BUCKET_NAME, selected_file)
        vector_store = create_vector_store(docs) 
        rag_application: RAGApplication
        base_llm_application = BaseLLMApplication
        options_manager = Options()

        rag_application = RAGApplication.initialize_rag(
            vector_store, rag_prompt, 
            LLMFactory.get_instance(temperature=options_manager.options["/set-temperature="]))
        base_llm_application = BaseLLMApplication.initialize_base_llm(
            base_prompt, 
            LLMFactory.get_instance(temperature=options_manager.options["/set-temperature="]))
     
        app = base_llm_application if options_manager.options["/no-rag"] else rag_application
        answer = app.run(options_manager.remaining_question)
        print("\nRéponse: ", answer)

        print("-" * 50)
        options_manager.reset()
        if not prompt:
            return Response({"error": "Text field is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # You'll write the rest of the processing logic here
        
        return Response({"message": answer, "received_text": prompt}, status=status.HTTP_200_OK)