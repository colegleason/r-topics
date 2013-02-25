import json

full_dict = {}

for i in range(4):
    with open("data/greatnwside"+str(i)+"_reddit.json", "r") as f:
        json_data = json.loads(f.read())
        full_dict.update(json_data)

with open("data/greatnwside_reddit.json", "w") as f:
    f.write(json.dumps(full_dict))
