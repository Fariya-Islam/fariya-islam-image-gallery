import React , {useState} from "react";
import { useDrag, useDrop } from "react-dnd";
import { useBetween } from 'use-between';
import galleryList from "./data";
import './Gallery.css';
import { Button } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const Card = ({ src, title, id, index, moveImage }) => {
  const ref = React.useRef(null);

  // For dropping image
  const [, drop] = useDrop({
    accept: "image",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  });

  // For dragging image 
  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging()
      };
    }
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

//  For selecting image from checkbox and change headers
  const { username, setUsername, count, setCount } = useBetween(useShareableState);
  const { images, setImages, selectedRows, setSelectedRows } = useBetween(useImageGallery);
  const handleClick = (event,props) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (value === true){
      willshow = willshow + 1;
        setCount(count + 1);
          if (count === 0)
            setUsername(count+1 + ' File Selected');
          else
            setUsername(count+1 + ' Files Selected');
    }
    else{
      willshow = willshow - 1;
        setCount(count - 1);
          if (count === 1)
            setUsername('Gallery');
          else if (count === 2)
            setUsername(count-1 + ' File Selected');
          else
            setUsername(count-1 + ' Files Selected');
    }

    if (selectedRows.includes(props)) {
      setSelectedRows(selectedRows.filter((id) => id !== props));
    } else {
      setSelectedRows([...selectedRows, props]);
    }
    const newData = images.map((row) => {
      if (row.id === props) {
        return { ...row};
      }
      return row;
    });
    setImages(newData);
}

  return (
    // Return image source for photo gallery 
    <ul className="image-gallery">
      <div ref={ref} style={{ opacity }} className="card" >
        <li>
          <input type="checkbox" checked={selectedRows.includes(id)} onClick={(e) => handleClick(e,id)}  />
            <label>
              <img src={src} alt={title}/>
              <div className="overlay"></div>
            </label>
        </li>
      </div>
    </ul>
  );
};

let willshow = 0;

// Sharing data between two constant 
const useShareableState = () => {
    const [username, setUsername] = useState('Gallery');
    const [count, setCount] = useState(0);
    return {
      username,
      setUsername,
      count,
      setCount
    }
  }

const useImageGallery = () => {
  const [images, setImages] = useState(galleryList);
  const [selectedRows, setSelectedRows] = useState([]);
  return {
    images,setImages,
    selectedRows,setSelectedRows
  }
}

const Gallery = () => {

    const { username, setUsername, count, setCount } = useBetween(useShareableState);
    const { images, setImages, selectedRows, setSelectedRows } = useBetween(useImageGallery);

    const deleteClick = () => {
      setUsername('Gallery');
      setCount(0);
      willshow = 0;
      const newData = images.filter((row) => !selectedRows.includes(row.id));
            setImages(newData);
            setSelectedRows([]);
    }

    // For swapping image 
    const moveImage = React.useCallback((dragIndex, hoverIndex) => {
    setImages((prevCards) => {
      const clonedCards = [...prevCards];
      const removedItem = clonedCards.splice(dragIndex, 1)[0];

      clonedCards.splice(hoverIndex, 0, removedItem);
      return clonedCards;
    });
  }, []);
  return (
    <div className="App">
        <div className="galleryheader">
            <h3 style={{display: 'inline-block', textAlign: 'left', padding: '10px 10px 10px'}}>{willshow === 0 ?
             '' : <CheckBoxIcon style={{ color: "blue" , float: 'left', paddingRight: '5px'}}/>}{username}</h3>
            <h3 style={{display: 'inline-block', float: 'right'}}>{willshow === 0 ? 
            '':(<Button 
                  style={{alignContent: 'right', padding: '10px 10px 10px', marginLeft:'50px', textTransform: 'none'} }
                  color="secondary" 
                  onClick={() => deleteClick()}
                  >Delete Files
              </Button>)}</h3>
        </div>
        <div className="galleryheader">
        <main>
        {React.Children.toArray(
            images.map((image, index) => (
            <div className={index === 0? 'mainF':'mainNF'}  >
            <Card
                src={image.img}
                title={image.title}
                id={image.id}
                index={index}
                selected={image.selected}
                moveImage={moveImage}
            />
            </div>
            ))
        )}
        </main>
        </div>
    </div>
  );
};

export default Gallery;
