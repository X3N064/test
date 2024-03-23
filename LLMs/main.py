model_url = "http://222.99.102.167:5000/v1/completions"

from langchain.chains import LLMChain
from langchain.globals import set_debug
from langchain.prompts import PromptTemplate
from langchain_community.llms import TextGen

set_debug(True)

template = """Question: {question}

Answer: Let's think step by step."""


prompt = PromptTemplate.from_template(template)
llm = TextGen(model_url=model_url)
llm_chain = LLMChain(prompt=prompt, llm=llm)
question = "What NFL team won the Super Bowl in the year Justin Bieber was born?"

llm_chain.run(question)