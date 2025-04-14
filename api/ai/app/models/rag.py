from langchain_core.output_parsers import StrOutputParser

class RAGApplication:
    def __init__(self, retriever, rag_chain):
        self.retriever = retriever
        self.rag_chain = rag_chain

    def run(self, question):
        documents = self.retriever.invoke(question)
        doc_texts = "\\n".join([doc.page_content for doc in documents])

        inputs = {"question": question, "documents": doc_texts}

        answer = self.rag_chain.invoke(inputs)
        
        return answer

    @staticmethod
    def initialize_rag(vector_store, prompt, llm):
        retriever = vector_store.as_retriever(k=4)
        rag_chain = prompt | llm | StrOutputParser()
        rag_application = RAGApplication(retriever, rag_chain)

        return rag_application
