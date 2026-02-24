import requests
r = requests.get("https://www.kabum.com.br")
print(r.status_code)
print(r.headers)
print(r.content)