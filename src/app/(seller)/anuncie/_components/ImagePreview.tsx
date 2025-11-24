import Image from 'next/image'

interface IPreviewProps {
  image: string
}

export default function ImagePreview({ image }: IPreviewProps) {


  if (image) {
    return (
      
        <Image
        src={image}
        alt=""
        fill
        className='object-contain rounded-lg'/>
      
      
    )
  } else {

    return (
      <div className='z-10 absolute'>
          <i className='fa fa-image text-7xl mx-auto mb-2'></i><br />
          <p><strong>Arraste</strong> e <strong>solte</strong> uma imagem <br /> ou <strong>clique</strong> para selecionar</p>
      </div>
    )
  }

}
