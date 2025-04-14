from langchain_core.prompts import PromptTemplate

rag_prompt = PromptTemplate(
    template="""You are a highly knowledgeable and concise assistant for answering questions. 
    Use the provided documents to construct an accurate response to the question. 
    Follow these guidelines:
    1. Base your answer strictly on the information in the documents.
    2. If the answer is not in the documents, say: "I don't know based on the provided information."
    
    Question: {question}
    Documents: {documents}
    Answer:
    """,
    input_variables=["question", "documents"],
)

base_prompt = PromptTemplate(
    template="""You are a highly knowledgeable and concise assistant for answering questions. 
    
    Question: {question}
    Answer:
    """,
    input_variables=["question"],
)
