if test -d ./api/venv; then 
   cd ./api && source venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt && python3 manage.py migrate;
else cd ./api && python3 -m venv venv  && source venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt && python3 manage.py migrate;
fi
cd ../client && npm install 
cd ../ && docker-compose -f Docker/docker-compose.dev.yml -p motor-m up --build --no-start
