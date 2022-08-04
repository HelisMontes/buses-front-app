import Swal from 'sweetalert2';


export default () => {
  return {
    fire: {
      success: ({ text }) => {
        Swal.fire({
          title: '',
          text,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
      },
      error: ({ text }) => {
        Swal.fire({
          title: '',
          text,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
    }
  }
}