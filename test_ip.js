const int_ip = require('internal-ip')

const get_ip = async () => {
  console.log(await int_ip.v4())
}

get_ip()
