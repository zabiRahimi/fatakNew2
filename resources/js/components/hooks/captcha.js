import React, { useState, useEffect , useImperativeHandle , forwardRef } from 'react';
import axios from 'axios';
import { trim } from 'jquery';
const Captcha = forwardRef((props, ref) => {
    const [captcha, setCaptcha] = useState(null)
    const [captchaKey, setCaptchaKey] = useState('')

    const refreshCaptcha = () => {
        axios.get('/api/web/refreshCaptcha')
            .then(response => {
                setCaptcha(response.data.url.img)
                setCaptchaKey(response.data.url.key);
            })
    }
   
    useImperativeHandle(ref,()=>({
        refreshCaptcha
        
    }))
   
    useEffect(()=>{
        
        
        refreshCaptcha()
    },[])
    const handleFocus = () => {
                $('.captchaInput').css('border-color', '#ced4da');
                $('.captchaFeedback').html(' ');
            }
        return (

            <div className="form-group formGroupDiv">
                <label htmlFor='captcha' className='labelForm'>
                    {/* css code label in form/main.scss */}
                         کد امنیتی
                         <i className="fa fa-star star" aria-hidden="true"></i>
                </label>
                <div className='captcha'>
                    <input type="text"  className='form-control inputForm captchaInput' id='captcha' onFocus={handleFocus} />
                    <div className='captchaPic'>
                        <img className='imgCaptcha' src={captcha} onClick={refreshCaptcha} />
                        <button type='button' onClick={refreshCaptcha} className='btn btn-outline-secondary btnCaptcha'> <i className="fas fa-sync-alt"></i></button>
                    </div>
                </div>
                {/* get key captcha and send */}
                <input id='captchaKey' type="hidden" value={captchaKey}/>
                <div className='validFeedback captchaFeedback'>
                    {/* css code label in form/main.scss */}

                </div>
            </div>
        )
    })
    // class Captcha extends Component {
    //     constructor(props) {
    //         super(props)
    //         this.state = {
    //             captchaSrc: null,
    //         }
    //         this.refreshCaptcha = this.refreshCaptcha.bind(this);
    //     }
    //     refreshCaptcha = () => {
    //         axios.get('/refreshCaptcha')
    //             .then(response => {
    //                 this.setState({ captchaSrc: response.data.captchaSrc })
    //             })
    //     }
    //     componentDidMount() {
    //         this.refreshCaptcha();
    //     }
    //     handleFocus = (e) => {
    //         $('.captchaInput').css('border-color', '#ced4da');
    //         $('.captchaFeedback').html(' ');
    //     }
    //     render() {

    //         return (

    //             <div className="form-group formGroupDiv">
    //                 <label htmlFor={this.props.id} className='labelForm'>
    //                     {/* css code label in form/main.scss */}
    //                  کد امنیتی
    //                  <i className="fa fa-star star" aria-hidden="true"></i>
    //                 </label>
    //                 <div className='captcha'>
    //                     <input type="text" className='form-control inputForm captchaInput' id='captcha'   onFocus={this.handleFocus} />
    //                     <div className='captchaPic'>
    //                         <img className='imgCaptcha' src={this.state.captchaSrc} onClick={this.refreshCaptcha} />
    //                         <button type='button' onClick={this.refreshCaptcha} className='btn btn-outline-secondary btnCaptcha'> <i className="fas fa-sync-alt"></i></button>
    //                     </div>
    //                 </div>
    //                 <div className='validFeedback captchaFeedback'>
    //                     {/* css code label in form/main.scss */}

    //                 </div>
    //             </div>
    //         )
    //     }
    // }

    export default Captcha;