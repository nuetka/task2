module.exports = (baseUrl) => (req, res) => {
    const parsedUrl = new URL(req.url, baseUrl)//урл получ из риквест
    const params = {}
    parsedUrl.searchParams.forEach((value, key) => params[key] = value)
    
   req.pathname = parsedUrl.pathname;
   req.params = params;
}