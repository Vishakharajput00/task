import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lastSaveTime, setLastSaveTime] = useState(null);


  const handleImageClick = (image) => {
      setOpen(true);
    setSelectedImage(image);
    // console.log(selectedImage,'selectwdimage')
  };
const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const [loading, setLoading] = useState(true);


  const [cards, setCards] = useState();

  const data = async ()=>{
    setLoading(true);

    try{
      const res = await axios({
        method:"GET",
        url:'http://localhost:3000/bankdata'
      });
      if(res){
        // console.log(res,'res----')
setCards(res.data)
setLoading(false);
      }

    }catch(error){
      console.log(error)
      setLoading(false);
    }
  }
 

  
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const handleDrop =async(e, index) => {
    const cardIndex = e.dataTransfer.getData('text/plain');
    const updatedCards = [...cards];
    const cardToMove = updatedCards[cardIndex];
    updatedCards.splice(cardIndex, 1);
    updatedCards.splice(index, 0, cardToMove);
// console.log("dsffge--------------",updatedCards)
    setCards(updatedCards);
    
 if(updatedCards){
  setTimeout(async() => {
    for(const i in updatedCards){
      const{id,title,type,position}=updatedCards[i]
      const DeletebyId = async ()=>{
      
    
        try{
          const res = await axios({
            method:"delete",
            url:`http://localhost:3000/bankdata/${id}`
          });
             
        }catch(error){
          console.log(error)
          setLoading(false);
        }
      }
      const updateData = async ()=>{
      
    
        try{
          const res = await axios({
            method:"delete",
            url:'http://localhost:3000/bankdata',
            data:{
              id,title,type,position
            }
          });
             
        }catch(error){
          console.log(error)
          setLoading(false);
        }
      }
      // await axios.delete(`http://localhost:3000/bankdata/${id}`)
      // await axios.post('http://localhost:3000/bankdata',{id,title,type,position})
      // setCards(updatedCards)
  
  
    }
   
    const timestamp = new Date().getTime();
    setLastUpdateTime(timestamp);
    localStorage.setItem('lastUpdateTime', timestamp);
    // alert("data changed ")
  }, 5000);
  
 }



  };
  let time;

  useEffect(() => {
    setTimeout(() => {
      data()
      const storedTimestamp = localStorage.getItem('lastUpdateTime');
      if (storedTimestamp) {
        setLastUpdateTime(parseInt(storedTimestamp));
      }
    }, 1000);

  }, [])
  return (
   <>
    {loading ? (
        <CircularProgress /> 
      ) : (
        <div>
          <p>Last update: {new Date(lastUpdateTime).toLocaleTimeString()}</p>

           <Grid container spacing={2}>
     {cards && (
      <>
      
       {cards.map((card, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
          <div
            className="card"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
             <img src={card.type} alt={card.title} 
            key={index}
          
            style={{width:"400px",height:"400px"}}
             onClick={() => handleImageClick(card)}/>
            <p>{card.title}</p>
           
          </div>
         
        </Grid>
         
      ))}
      </>
     )}
    </Grid>
        </div>
      )}
  

     <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
           {selectedImage && 
          <>
           <h4>
            {selectedImage.title}
           </h4>
          
          </>
         }
        </DialogTitle>
        <DialogContent>
          {selectedImage && 
          <>
          
          <img src={selectedImage.type}  style={{width:"400px",height:"400px"}} />
          </>
         }
        </DialogContent>
      </Dialog>
   </>
  );
};

export default Home;

  
