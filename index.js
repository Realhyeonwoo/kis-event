localStorage.clear();

function readExcel() {
  let input = event.target;
  let reader = new FileReader();
  reader.onload = function () {
    let data = reader.result;
    let workBook = XLSX.read(data, { type: "binary" });
    workBook.SheetNames.forEach(function (sheetName) {
      rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
      data = JSON.stringify(rows);
      localStorage.setItem("data", data);
    });
    $("#data").text(JSON.parse(data).length);
    // alert(`입력한 임직원 수: ${JSON.parse(data).length}명`)
    // if(data.length !== 0){
    //     document.querySelector(".div1").style.display = 'none';
    // }
  };
  reader.readAsBinaryString(input.files[0]);
}

const moveSlot = () => {
  const data = localStorage.getItem("data");
  console.log(data);
  if (data === null || data.length === 0) {
    alert("임직원 데이터를 업로드해주세요.");
  } else {
    window.location.href = "slot.html";
  }
};

document.querySelector("html").classList.add('js');

var fileInput  = document.querySelector( ".input-file" ),  
    button     = document.querySelector( ".input-file-trigger" ),
    the_return = document.querySelector(".file-return");
      
button.addEventListener( "keydown", function( event ) {  
    if ( event.keyCode == 13 || event.keyCode == 32 ) {  
        fileInput.focus();  
    }  
});
button.addEventListener( "click", function( event ) {
   fileInput.focus();
   return false;
});  
fileInput.addEventListener( "change", function( event ) {  
    the_return.innerHTML = this.value;  
});  