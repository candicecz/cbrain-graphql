echo "Token: $1"

curl -H "Authorization: Bearer $1" localhost:4000/ \
  -F operations='{ "query": "mutation ($input: UserfileInput!) { uploadUserfile(input: $input) { success, status }  }", "variables": { "input": { "file": null, "dataProviderId": "2", "groupId": "2", "extract": false }  }  }' \
  -F map='{ "0": ["variables.input.uploadFile"]  }' \
  -F 0='@test-file.txt'


