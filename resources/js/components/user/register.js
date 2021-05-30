import React, { useState, useRef } from 'react';
import useTitleForm from '../hooks/useTitleForm';
import Captcha from '../hooks/captcha';
import useScrollTo from '../hooks/useScrollTo';
import Swal from 'sweetalert2';
import $ from "jquery";
export default function Register() {
    const changeCaptcha = useRef()
    const [element, setElement] = useState({
        name: null,
        email: null,
        mobile: null,
        pass: null,
    });

    const handleCheckValue = e => {
        let { id, value } = e.target;
        const idParent = e.target.parentNode.id;
        const errorDiv = e.target.parentNode.parentNode.lastChild;
        value = checkMobile(id, value);
        setElement(prev => ({ ...prev, [id]: value }));
        axios.post('/api/web/authUser/register', { [id]: value }, { headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } })
            .then(function (response) {
                valTrue(idParent);
            })
            .catch((error) => {
                varFalse(idParent, errorDiv, error.response.data.errors[id]);
            })
    }
    /**
     * هنگامی که اطلاعات یک فیلد به درستی احراز شد این متد کادر فیلد را سبز رنگ می کند
     * @param idParent 
     */
    const valTrue = (idParent) => {
        $('#' + idParent).css("border", "1px solid green");
        $(`#${idParent} i.true`).css("display", "flex");
    }

    /**
     * چنانچه کاربر صفر ابتدایی شماره موبایل را نگذاشته باشد این متد صفر را اضافه می کند
     * @param id 
     * @param value 
     */
    const checkMobile = (id, value) => {
        const checkMobile = /^[0-9]{10}$/;
        if (id == 'mobile' && checkMobile.test(value)) {
            value = 0 + value;
        }
        return value;
    }

    /**
     * چنانچه کاربر اطلاعات نادرستی وارد کند متد زیر باقرمز کردن کادر فیلد و اعلام خطا هشدار لازم را می دهد
     * @param idParent 
     * @param errorDiv 
     * @param errorMassege 
     */
    const varFalse = (idParent, errorDiv, errorMessage) => {
        $('#' + idParent).css("border", "1px solid red");
        $(`#${idParent}`).addClass('inputFromSelect');
        $(`#${idParent} i.false`).css("display", "flex");
        errorDiv.innerHTML = errorMessage
    }

    const errorSubmit = (e, errorStatus,errorData, element, idForm) => {
        backStyle(e ,errorStatus , errorData , element);

        const offset = $(".errorAll").offset();
        $(document).scrollTop(offset.top - 80);

        $('#captcha').val('');
        changeCaptcha.current.refreshCaptcha();

        let errorMessage;
        if (errorStatus == 422) {
            errorMessage = 'اخطار! لازم است همه فیلدها را وارد کنید.'
        }
        else {
            errorMessage = 'خطایی رخ داده است ، لطفا دوباره تلاش کنید .'
            $(`#${idForm}`).trigger('reset');
            for (let i in element) {
                setElement(perv => ({ ...perv, [i]: null }));
            }

            // backStyle(e);
        }
        $('.errorAll').html(
            `<div class='alert alert-danger errorAll' >${errorMessage}</div> `
        );
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let data = { ...element, captcha: $('#captcha').val(), key: $('#captchaKey').val() }
        console.log($('#captchaKey').val());
        console.log($('#captcha').val());
        
        axios.post('/api/web/authUser/register', data, { headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'), 'Content-Type': 'application/json; charset=utf-8' } })
            .then(response => {
                // props.history.replace('/endRegisterSocialNetwork', response.data.socialNetwork)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'ثبت نام با موفقیت انجام شد .',
                    showConfirmButton: false,
                    timer: 3000
                })
            })
            .catch(error => {
                // const errorData = error.response.data.errors;
                // console.log(errorData);


                errorSubmit(e, error.response.status,error.response.data.errors, element, 'registerUser');
                // $('#captcha').val('')
                // $('.captchaFeedback').html('')
                // changeCaptcha.current.refreshCaptcha()
                // if (error.response.status == 422) {
                //     const offset = $(".errorAll").offset();
                //     $(document).scrollTop(offset.top - 80)
                //     $('.errorAll').html(
                //         `<div class='alert alert-danger errorAll' >اخطار! لازم است فیلدهای ستاره دار را وارد کنید.</div> `
                //     )
                //     // const errorData = error.response.data.errors;
                //     // const firstError = Object.keys(errorData)[0];
                //     // const offset = $("#" + firstError).offset();
                //     // $(document).scrollTop(offset.top - 80)
                //     // for (let i in errorData) {
                //     //     document.getElementById(i).parentElement.parentElement.lastElementChild.innerHTML = errorData[i];
                //     // }
                // }
                // else {
                //     const offset = $(".errorAll").offset();
                //     $(document).scrollTop(offset.top - 80)
                //     $('#registerUser').trigger('reset');
                //     for (let i in element) {
                //         setElement(perv => ({ ...perv, [i]: null }))
                //         $('#' + i).css("border-color", "#e3e9ef")
                //     }
                //     $('.errorAll').html(
                //         `<div class='alert alert-danger errorAll' >خطایی رخ داده است ، لطفا دوباره تلاش کنید .</div> `
                //     )
                // }
            })
    }
    const backStyle = (e, errorStatus = null, errorData = null, element = null) => {
        if (e.type == 'focus') {
            const idParent = e.target.parentNode.id;
            $(`#${idParent} i`).css("display", "none");
            const child = e.target.parentNode.parentNode.lastChild;
            child.innerHTML = ''
        }else{
            let valElement;
            (errorStatus == 422)?valElement = errorData: valElement=element;
            for (let i in valElement) {
                        const idParent = document.getElementById(i).parentNode.id;
                        $(`#${idParent}`).removeClass('inputFromSelect');
                        $('#' + idParent).css("border", "1px solid #eaecef");
                        $(`#${idParent} i`).css("display", "none");
                        const child = document.getElementById(i).parentNode.parentNode.lastChild;
                        $(`#${idParent} label`).css('display', 'none');
                        $(`#${idParent} input`).css('direction', 'rtl');
                        $(`#${idParent} input`).val('');
                        child.innerHTML = ''
                        }
        }
        
        // else if (errorStatus == 422) {
        //     console.log(errorStatus);
        //     for (let i in errorData) {
        //         const idParent = document.getElementById(i).parentNode.id;
        //         $(`#${idParent}`).removeClass('inputFromSelect');
        //         $('#' + idParent).css("border", "1px solid #eaecef");
        //         $(`#${idParent} i`).css("display", "none");
        //         const child = document.getElementById(i).parentNode.parentNode.lastChild;
        //         $(`#${idParent} label`).css('display', 'none');
        //         $(`#${idParent} input`).css('direction', 'rtl');
        //         $(`#${idParent} input`).val('');
        //         child.innerHTML = ''
        //         }
            
        // } else {
        //     console.log(errorStatus);
        //     for (let i in element) {
        //         setElement(perv => ({ ...perv, [i]: null }))
        //         const idParent = document.getElementById(i).parentNode.id;
        //         // $(`#${idParent}`).removeClass('inputFromSelect');
        //         // $('#' + idParent).css("border", "1px solid #eaecef");
        //         $(`#${idParent} i`).css("display", "none");
        //         $(`#${idParent} label`).css('display', 'none');
        //         $(`#${idParent} input`).css('direction', 'rtl');
        //         const child = document.getElementById(i).parentNode.parentNode.lastChild;
        //         child.innerHTML = ''
        //     }
            
        // }
        // const idParent = e.target.parentNode.id;
        // $(`#${idParent}`).removeClass('inputFromSelect');
        // $('#' + idParent).css("border", "1px solid #eaecef");
        // $(`#${idParent} i`).css("display", "none");
        // const child = e.target.parentNode.parentNode.lastChild;
        // child.innerHTML = ''
    }
    const ChangeStyle = (e) => {
        //    چون تغییرات بر روی کلاس دایو پدر انجام  می گیرد لذا با دستور زیر آی دی دایو پدر را بدست می آوریم
        const id = e.target.parentNode.id;
        //    const name=e.target.parentNode.name;
        const lang = document.getElementById(id).getAttribute('data-lang');
        // با دستور زیر مقدار این پوت را بدست می آوریم تا در صورت خالی بودن این پوت دایو به حالت اول برگردد، البته این زمانی اتفاق می افتد که کاربر مقداری را وارد کرده و سپس این پوت را خالی می کند   
        let check = $(`#${id} input`).val();
        if (check) {
            $(`#${id} label`).css('display', 'flex');
            $(`#${id}`).addClass('inputFromSelect');
            if (lang == 'en' || lang == 'num' || lang == 'en_num') {
                $(`#${id} input`).css('direction', 'ltr');
            }
        } else {
            $(`#${id} label`).css('display', 'none');
            $(`#${id}`).removeClass('inputFromSelect');
            $(`#${id} input`).css('direction', 'rtl');
        }
    }



    return (
        <div className='formContainer'>
            <div className="formRight">
                {useTitleForm('ثبت نام')}
                <form className='form' id='registerUser' method='post' onSubmit={handleSubmit}>
                    <div className='errorAllContiner errorAll' id='errorAll'></div>
                    <div className="groupInput">
                        <div className="inputForm " id='divName' data-lang='fa' >
                            <div className='divLabel'>
                                <i className='far fa-check-circle true'></i><i className='fas fa-exclamation false'></i>

                                <label htmlFor="name">نام و نام خانوادگی <i>(به فارسی)</i></label>

                            </div>
                            <input type="text" id='name' onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} placeholder='نام و نام خانوادگی' autoComplete="off" autoFocus />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    <div className="groupInput">
                        <div className="inputForm " id='divEmail' data-lang='en'>

                            <div className='divLabel'>
                                <i className='far fa-check-circle true'></i><i className='fas fa-exclamation false'></i>
                                <label htmlFor="name">ایمیل</label>
                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='email' placeholder='ایمیل' autoComplete="off" />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    <div className="groupInput">
                        <div className="inputForm " id='divMobile' data-lang='num'>
                            <div className='divLabel'>
                                <i className='far fa-check-circle true'></i><i className='fas fa-exclamation false'></i>
                                <label htmlFor="name">موبایل </label>
                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='mobile' placeholder='موبایل' autoComplete="off" />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    <div className="groupInput">
                        <div className="inputForm " id='divPass' data-lang='en_num'>
                            <div className='divLabel'>
                                <i className='far fa-check-circle true'></i><i className='fas fa-exclamation false'></i>
                                <label htmlFor="name">رمز عبور </label>
                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='pass' placeholder='رمز عبور' autoComplete="off" />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    < Captcha ref={changeCaptcha} backStyle={backStyle} ChangeStyle={ChangeStyle} />
                    <input type="submit" className='btnForm' id="" value='ثبت' />


                </form>
            </div>
            <div className="formLeft">
                {/* عکس قرار می گیرد */}
                image
            </div>
        </div>
    )

}


