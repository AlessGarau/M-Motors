from langchain_core.output_parsers import StrOutputParser
from langchain_ollama.llms import OllamaLLM

class LLMFactory:
    @staticmethod
    def get_instance(model="llama3.2:1b", temperature=0.7):
        return OllamaLLM(model=model, temperature=temperature)

class BaseLLMApplication:

    def __init__(self, llm_chain):
        self.llm_chain = llm_chain

    def run(self, question):
        answer = self.llm_chain.invoke({"question": question})
        return answer

    @staticmethod
    def initialize_base_llm(prompt, llm):
        llm_chain = prompt | llm | StrOutputParser()
        base_llm_application = BaseLLMApplication(llm_chain)
        return base_llm_application
