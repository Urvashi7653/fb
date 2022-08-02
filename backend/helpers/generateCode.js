function generateCode(length) {
    let code = "";
    let schema = "0123456789";
  
    for (let i = 0; i < length; i++) {
      code += schema.charAt(Math.floor(Math.random() * schema.length));
    }
  
    return code;
  }
  
  module.exports = generateCode;

  //THIS WOULD HAVE GIVEN SAME OUTPUT:
  // let code = "";
  
  //   for (let i = 0; i < length; i++) {
  //     code += Math.floor(Math.random() * 10);
  //   }
  // console.log(code);