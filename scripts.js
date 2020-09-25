const photoFile = document.getElementById('photo-file');
let photoPreview = document.getElementById("photo-preview");
let image;
const cropButton = document.getElementById("crop-image");
const selection = document.getElementById('selection-tool');
let startX, startY, relativeStartX, relativeStartY, endX, endY, relativeEndX, relativeEndY;
let startSelection = false;
let photoName;



//Select $ image preview



document.getElementById("select-image").onclick = () => {
  photoFile.click();
}


window.addEventListener("DOMContentLoaded", () => {
  photoFile.addEventListener("change", () => {
    let file = photoFile.files.item(0);
    photoName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      image = new Image();
      image.src= event.target.result;
      image.onload = onLoadImage;

    }
  })

})



// Selection tool




const events = {
  mouseover() {
    this.style.cursor = 'crosshair'
  },
  mousedown(event) {
    const {
      clientX,
      clientY,
      offsetX,
      offsetY
    } = event
    // console.table({
    //   "client":[clientX,clientY],
    //   "offset":[offsetX,offsetY]
    // })
    startX = clientX;
    startY = clientY;
    relativeStartX = offsetX;
    relativeStartY = offsetY;
    startSelection = true;


  },
  mousemove(event) {
    endX = event.clientX;
    endY = event.clientY;
    if (startSelection) {
      selection.style.display = 'initial'
      selection.style.top = startY + 'px';
      selection.style.left = startX + 'px';
      selection.style.width = (endX - startX) + 'px';
      selection.style.height = (endY - startY) + 'px';
    }
  },
  mouseup(event) {
    startSelection = false;
    relativeEndX = event.laeyrX;
    relativeEndY = event.laeyrY;
    //Mostrar o botao de corte
    cropButton.style.display = 'initial'
  }

}
Object.keys(events).forEach((eventName) => {
  photoPreview.addEventListener(eventName, events[eventName])

})



//CANVAS



let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
 function onLoadImage(){
  const {
    width,
    height
  } = image
  canvas.width = width;
  canvas.height = height;
  // Limpar o contexto CTX
  ctx.clearRect(0, 0, width, height)

  //desenhar a imagem no contexto
  ctx.drawImage(image, 0, 0);
  photoPreview.src = canvas.toDataURL();
}

//Cortar Image

cropButton.onclick = () =>{
  const {width:imgWidth, height:imgHeight} = image;
  const {width:previewWidth, height:previewHeight} = photoPreview;
  
  const [widthFactor,heightFactor] =[
    +(imgWidth / previewWidth),
    +(imgHeight / previewHeight)
  ];

  const[selectionWidth,SelectionHeight] = [
    selection.style.width.replace('px',''),
    selection.style.height.replace('px','')
  ]
  const [croppedWidth, croppedHeight] = [
    +(selectionWidth * widthFactor),
    +(SelectionHeight * heightFactor)
  ]

  const [actualX, actualY] = [
    +( relativeStartX * widthFactor),
    +( relativeStartY * heightFactor)
  ]
  // falar em que lugar da imagem esta o retangulo cortado
const croppedImage = ctx.getImageData(actualX,actualY,croppedWidth,croppedHeight);

 

//limpar o ctx do canvas
ctx.clearRect(0,0,ctx.Width,ctx.height);


// ajustar proporçoes

image.width = canvas.width = croppedWidth;
image.height = canvas.height = croppedHeight;

//Adiciona imagem cortado ao canvas
ctx.putImageData(croppedImage,0,0)

//Esconder a ferramenta de seleção
selection.style.display ='none'

//atualizar o preview da imagem
photoPreview.src = canvas.toDataURL();
//mostrar botao de download
downloadButton.style.display= 'initial'
}

//Download
const downloadButton = document.getElementById('download');
downloadButton.onclick = ()=>{
  const a = document.createElement("a");
  a.download = photoName + "-cropped.png";
  a.href = canvas.toDataURL();
  a.click()

}