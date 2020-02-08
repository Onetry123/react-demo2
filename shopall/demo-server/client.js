let http = require('https')

http.get('https://www.imooc.com/search/hotwords', (res) => {
  let data = '';
  res.on('data', (chunk) => {
      data+=chunk
  })
  res.on('end', () => {
    let result = JSON.parse(data)
    console.log(result.data)
  })
})
{}
