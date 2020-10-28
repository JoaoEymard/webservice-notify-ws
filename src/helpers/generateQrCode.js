const { default: Axios } = require("axios");

module.exports = async function (code) {
  try {
    const { data: result } = await Axios.post(
      `https://qr-generator.qrcode.studio/qr/custom`,
      {
        data: code,
        size: 250,
        download: false,
        file: "svg",
      }
    );

    return result;
  } catch (error) {
    console.log(error);
  }
};
