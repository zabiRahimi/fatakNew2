import React, { Component, useEffect, useState, useRef } from 'react';
import useTitleForm from '../hooks/useTitleForm';
import Captcha from '../hooks/captcha';
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
        const child = e.target.parentNode.parentNode.lastChild;
        // console.log(idParent);
        const checkMobile = /^[0-9]{10}$/;
        if (id == 'mobile' && checkMobile.test(value)) {
            value = 0 + value;
        }
        setElement(prev => ({ ...prev, [id]: value }))
        // // because in this fun to send only element , also geting errors for of this dont use fun then
        axios.post('/api/web/authUser/register', { [id]: value }, { headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'), 'accept': 'application/json' } })
            .then(function (response) {
                $('#' + idParent).css("border", "1px solid green");
                $(`#${idParent} i.true`).css("display", "flex");
                child.innerHTML = '';
            })
            .catch((error) => {
                $('#' + idParent).css("border", "1px solid red");
                $(`#${idParent}`).addClass('inputFromSelect');
                $(`#${idParent} i.false`).css("display", "flex");
                child.innerHTML = error.response.data.errors[id]
            })
    }
 
    const handleSubmit = (e) => {
        e.preventDefault();
        let data = { ...element, captcha: $('#captcha').val() , key:$('#captchaKey').val() }
        console.log(data);
        
        axios.post('/api/web/authUser/register', data, { headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),'Content-Type': 'application/json; charset=utf-8' } })
            .then(response => {
                console.log(response.data);
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
                console.log(error.response.data.errors);
                
                $('#captcha').val('')
                $('.captchaFeedback').html('')
                changeCaptcha.current.refreshCaptcha()
                if (error.response.status == 422) {
                    const errorData = error.response.data.errors;
                    const firstError = Object.keys(errorData)[0];
                    const offset = $("#" + firstError).offset();
                    $(document).scrollTop(offset.top - 80)
                    for (let i in errorData) {
                        $('#' + i).css("border-color", "red")
                        $('.' + i + 'Feedback').html(errorData[i])
                    }
                }
                else {
                    const offset = $(".errorAll").offset();
                    $(document).scrollTop(offset.top - 80)
                    $('#formRegisterChannel').trigger('reset');
                    for (let i in element) {
                        setElement(perv => ({ ...perv, [i]: null }))
                        $('#' + i).css("border-color", "#e3e9ef")
                    }
                    $('.errorAll').html(
                        `<div class='alert alert-danger errorAll' >خطایی رخ داده است ، لطفا دوباره تلاش کنید .</div> `
                    )
                }
            })
    }
    const backStyle = (e) => {


        const idParent = e.target.parentNode.id;
        $(`#${idParent}`).removeClass('inputFromSelect');
        $('#' + idParent).css("border", "1px solid #eaecef");
        $(`#${idParent} i`).css("display", "none");
        const child = e.target.parentNode.parentNode.lastChild;
        child.innerHTML = ''
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
                <form className='form' id='formRegister' method='post' onSubmit={handleSubmit}>
                    <div className="groupInput">
                        <div className="inputForm " id='divName' data-lang='fa' >
                            <div className='divLabel'>
                                <i className='far fa-check-circle true'></i><i className='fas fa-exclamation false'></i>

                                <label htmlFor="name">نام و نام خانوادگی <i>(به فارسی)</i></label>

                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='name' placeholder='نام و نام خانوادگی' />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    <div className="groupInput">
                        <div className="inputForm " id='divEmail' data-lang='en'>

                            <div className='divLabel'>
                                <i className='far fa-check-circle true'></i><i className='fas fa-exclamation false'></i>
                                <label htmlFor="name">ایمیل</label>
                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='email' placeholder='ایمیل' />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    <div className="groupInput">
                        <div className="inputForm " id='divMobile' data-lang='num'>
                            <div className='divLabel'>
                                <i className='far fa-check-circle true'></i><i className='fas fa-exclamation false'></i>
                                <label htmlFor="name">موبایل </label>
                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='mobile' placeholder='موبایل' />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    <div className="groupInput">
                        <div className="inputForm " id='divPass' data-lang='en_num'>
                            <div className='divLabel'>
                                <i className='far fa-check-circle true'></i><i className='fas fa-exclamation false'></i>
                                <label htmlFor="name">رمز عبور </label>
                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='pass' placeholder='رمز عبور' />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    < Captcha  ref={changeCaptcha} />
                    <input type="submit" className='btnForm' id=""  value='ثبت' />


                </form>
            </div>
            <div className="formLeft">
                {/* عکس قرار می گیرد */}
                image
            </div>
        </div>
    )

}


