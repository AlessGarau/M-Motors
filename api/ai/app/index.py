import os

from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings

from modules.options import Options
from modules.s3 import FileStorage
from models.llm import BaseLLMApplication, LLMFactory
from models.rag import RAGApplication
from models.prompt import rag_prompt, base_prompt

BUCKET_NAME = "contracts"

def create_vector_store(docs):
    embeddings = OllamaEmbeddings(model='llama3.2:1B')
    # doc_vectors = [embeddings.embed_query(doc.page_content) for doc in docs]

    vector_store = FAISS.from_documents(
        docs,
        embedding=embeddings
    )

    return vector_store


def clear_screen():
    if os.name == 'nt':
        os.system('cls')
    else:  
        os.system('clear')

def main():
    clear_screen()
    BUCKET_NAME = "contracts"

    files = FileStorage.list_files_in_bucket(BUCKET_NAME)
    if not files:
        print("\nAucun fichier dans le Bucket. Fin du processus.")
        return

    print("\nFichiers disponibles dans le bucket S3 :\n")
    for idx, file in enumerate(files, start=1):
        print(f"{idx}. {file}")

    file_choice = input("Veuillez choisir un fichier (par numéro) : ")

    try:
        file_choice = int(file_choice)
        selected_file = files[file_choice - 1]

        print(f"\n{selected_file}")
    except (ValueError, IndexError):
        print("Choix invalide. Fin du processus.")
        return

    docs = FileStorage.process_pdf_file(BUCKET_NAME, selected_file)
    vector_store = create_vector_store(docs) 
    rag_application: RAGApplication
    base_llm_application = BaseLLMApplication
    clear_screen()
    print("\nBienvenue sur l'application de RAG! '/help' pour les commandes, '/exit' pour quitter.")

    options_manager = Options()
    while True:
        question = input("Message solana-llama >>> ")
        if question.lower() == "/exit":
            print("Aurevoir!")
            break

        response = options_manager.parse(question)
        if (response["temperature-change"]):
            continue

        if (options_manager.options["/help"]):
            print("""
                Commandes disponibles:
                /no-rag <message>     Désactiver le RAG sur cette question.
                /demo <message>       Lancer la question en mode demo.
                /help                 Montrer les commandes disponibles.
                /exit                 Quitter l'application.
                /set-temperature=<n>  Définir la temperture du LLM (ex: /set-temperature=0.7).
            """)

            options_manager.reset()
            continue

        rag_application = RAGApplication.initialize_rag(
            vector_store, rag_prompt, 
            LLMFactory.get_instance(temperature=options_manager.options["/set-temperature="]))
        base_llm_application = BaseLLMApplication.initialize_base_llm(
            base_prompt, 
            LLMFactory.get_instance(temperature=options_manager.options["/set-temperature="]))

        if (options_manager.options["/demo"]):
            rag_answer= rag_application.run(options_manager.remaining_question)
            norag_answer= base_llm_application.run(options_manager.remaining_question)

            print("\nRéponse sans RAG: ", norag_answer)
            print("\nRéponse avec RAG: ", rag_answer)
        else:
            app = base_llm_application if options_manager.options["/no-rag"] else rag_application
            answer = app.run(options_manager.remaining_question)
            print("\nRéponse: ", answer)

        print("-" * 50)
        options_manager.reset()

if __name__ == "__main__":
    main()
