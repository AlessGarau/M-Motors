import boto3
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from botocore.config import Config

# AWS_ENDPOINT = "http://127.0.0.1:9000"
# ACCESS_KEY = "minioadmin"
# SECRET_KEY = "minioadmin"

s3_client = boto3.client(
    "s3",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="minioadmin",
    aws_secret_access_key="minioadmin",
)

class FileStorage:
    @staticmethod
    def process_pdf_file(bucket_name, file_name):
        local_file_path = f"/tmp/{file_name}"
        s3_client.download_file(bucket_name, file_name, local_file_path)

        # Read and extract text from the PDF file
        reader = PdfReader(local_file_path)
        pdf_content = ""
        for page in reader.pages:
            pdf_content += page.extract_text()

        if not pdf_content.strip():
            raise ValueError("Ce PDF ne contient pas de texte. Le RAG nécessite un Corpus de Texte.")

        # Split the text using LangChain's text splitter
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.create_documents([pdf_content])
        print(f"Number of chunks created: {len(docs)}")

        return docs

    @staticmethod
    def list_files_in_bucket(bucket_name):
        try:
            response = s3_client.list_objects_v2(Bucket=bucket_name)
            if 'Contents' not in response:
                print("No file in this bucket, add one at http://localhost:9001.")
                return []
            files = [obj['Key'] for obj in response['Contents']]
            print("files", files)
            return files
        except Exception as e:
            print(f"Error fetching files from S3: {e}")
            return []
