import re

class Options:
    def __init__(self) -> None:
        self.options = {
                "/no-rag": False,
                "/demo": False,
                "/help": False,
                "/set-temperature=": None 
            }

        self.remaining_question = ""

    def parse(self, question):
        self.remaining_question = question
        response = {
            "temperature-change": False
        }
        for option in self.options:
            if question.startswith(option):
                if option.endswith("="): # Handle values setting option
                    match = re.match(f"{re.escape(option)}(.*)", question)
                    if match:
                        value = match.group(1).strip()
                        try:
                            response["temperature-change"] = option == "/set-temperature="
                            self.options[option] = float(value)
                        except ValueError:
                            print(f"Valeur invalide pour {option}. Veuillez donner un nombre.")
                            self.options[option] = None  # Reset to default
                        self.remaining_question = ""
                else: # Handle flags
                    self.options[option] = True
                    self.remaining_question = question[len(option):].strip()
                break

        return response
            
    def reset(self):
        self.options = {
                "/no-rag": False,
                "/demo": False,
                "/help": False,
                "/set-temperature=": self.options["/set-temperature="] 
            }


