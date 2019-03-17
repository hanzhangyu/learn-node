<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        img {
            display: block;
            max-height: 200px;
        }
    </style>
</head>
<body>

<form enctype="multipart/form-data" action="/" method="post">
    <input type="file" name="file">
    <input type="submit" id="submit">
</form>
<h3>client img</h3>
<img id="img" src="" alt="">
<h3>server img</h3>
<img id="server_img" src="" alt="">
<script>
document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    /* test for data type */
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

    /* sending */
    const formData = new FormData();
    console.log(e.target.form[0].name);
    formData.append('file', e.target.form[0].files[0], e.target.form[0].files[0].name);

    fetch('/', {
        method: 'PUT',
        body: formData
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            document.getElementById('server_img').src = response.image;
        });
})
</script>
</body>
</html>
