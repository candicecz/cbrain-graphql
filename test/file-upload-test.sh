echo "Token: $1"

curl -H "Authorization: Bearer $1" localhost:4000/ \
  -F operations='{ "query": "mutation ($input: UserfileInput!) { uploadUserfile(input: $input) { id, name }  }", "variables": { "input": { "uploadFile": null, "dataProviderId": "2", "groupId": "2", "fileType": "SingleFile", "extract": false }  }  }' \
  -F map='{ "0": ["variables.input.uploadFile"]  }' \
  -F 0=@a.txt
