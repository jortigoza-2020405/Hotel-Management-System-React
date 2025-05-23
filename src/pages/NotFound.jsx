import React from 'react'
import '../styles/global.css'

const NotFound = () => {
  return (
    <div className="not-found-container" style={{ textAlign: 'center', padding: '4rem' }}>
      <img
        src="https://res.cloudinary.com/dwvxmneib/image/upload/v1747990313/edce898a-3462-48cb-a006-6ecb8adaf2ef_zxnvd6.png"
        alt="404 Not Found"
        style={{ maxWidth: '100%', height: 'auto', maxHeight: '90vh' }}
      />
    </div>
  )
}

export default NotFound