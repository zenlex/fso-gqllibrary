const Notify = ({errorMessage, successMessage}) => {
  const errStyle = {
    color: 'red'
  }
  const successStyle = {
    color: 'green'
  }

  const msgStyle = errorMessage ? errStyle : successStyle;

  return(
    <div>
      <h2 style={msgStyle}>{errorMessage || successMessage}</h2>
    </div>
  )
}

export default Notify;