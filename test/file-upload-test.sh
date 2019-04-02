curl localhost:4000/ \
  -F operations='{ "query": "mutation ($input: UserfileInput!) { uploadUserfile(input: $input) { id, name }  }", "variables": { "input": { "uploadFile": null, "dataProviderId": "2", "groupId": "2", "fileType": "text_file", "extract": false }  }  }' \
  -F map='{ "0": ["variables.input.uploadFile"]  }' \
  -F 0=@a.txt
