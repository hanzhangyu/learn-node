<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form enctype="multipart/form-data" action="/" method="post">
    <input type="file" name="file">
    <input type="submit" id="submit">
</form>
<img id="img" src="" alt="">
<script>
document.getElementById('submit').addEventListener('click', (e) => {
    // e.preventDefault();
    console.log(Object.keys(e.target.form)); // form element
    console.log(Object.keys(e.target.form[0])); // file
    console.log(e.target.form[0].files); // file list
    console.log(e.target.form[0].files[0].slice()); // blob
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        document.getElementById('img').src = reader.result;
    });
    // reader.readAsDataURL(e.target.form[0].files[0].slice())
    reader.readAsDataURL(e.target.form[0].files[0]) // 支持Blob或者File
    console.log(reader);
})
</script>
</body>
</html>
