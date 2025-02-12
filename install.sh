if test -d ./api/venv; then 
   cd ./api && source venv/bin/activate && pip install -r requirements.txt;
else cd ./api && python3 -m venv venv  && source venv/bin/activate && pip install -r requirements.txt;
fi
cd ../client && npm install 
cd ../ && docker-compose -f Docker/docker-compose.dev.yml -p motor-m up --build --no-start
