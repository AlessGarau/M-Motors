from langchain_core.prompts import PromptTemplate

rag_prompt = PromptTemplate(
    template="""Ceci est un contrat de location ou vente de voiture. Le document n'est pas sensible. Répond précisemment à la question de façon concise. Utilise le pour répondre à la question"
    
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
