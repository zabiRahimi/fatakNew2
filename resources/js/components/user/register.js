import React, { Component, useEffect, useState } from 'react';
import useTitleForm from '../hooks/useTitleForm';
import Captcha from '../hooks/captcha';
import $ from "jquery";



export default function Register() {
    const [element, setElement] = useState({
        name: null,
        email: null,
        mobile: null,
        pass: null,
        captcha:null,
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

        console.log(id);

        // // because in this fun to send only element , also geting errors for of this dont use fun then
        axios.post('/api/web/authUser/register', { [id]: value }, { headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'), 'accept': 'application/json' } })
            .then(function (response) {

                $('#' + idParent).css("border", "1px solid green");
                // $(`#${idParent} label i.false`).css("display", "flex");

                $(`#${idParent} i.true`).css("display", "flex");
                child.innerHTML = '';
            })
            .catch((error) => {
                $('#' + idParent).css("border", "1px solid red");
                $(`#${idParent}`).addClass('inputFromSelect');

                $(`#${idParent} i.false`).css("display", "flex");
                child.innerHTML = error.response.data.errors[id]
                // if (error.response.status == 500) {
                //     $('#' + idParent).css("border","1px solid green");
                // }
                // else{
                // const checkError = error.response.data.errors[id]
                // if (checkError) {
                //     setElement(prevState => ({ ...prevState, [id]: null }))
                //     $('#' + idParent).css("border", "1px solid red");
                //     $(`#${idParent} label i.false`).css("display", "flex");
                //     $('.' + idParent + 'Feedback').html(checkError)
                // }
                // else {
                //     $('#' + idParent).css("border","1px solid green");
                //     $(`#${idParent} label i.true`).css("display", "flex");


                // }
                // }
            })

    }
    // const checkInput=(e)=>{
    //     const id=e.target.id;
    //     const val=document.getElementById(id).value;
    //     setName(val)
    // }
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
                <i className="fa fa-star star" aria-hidden="true"></i>
                <i className="fas fa-sync-alt"></i>
                <div>{name} </div>
                <form className='form' action="">
                    <div className="groupInput">
                        <div className="inputForm " id='divName' data-lang='fa' >
                            <div className='divLabel'>
                                <i class='far fa-check-circle true'></i><i class='fas fa-exclamation false'></i>

                                <label htmlFor="name">نام و نام خانوادگی <i>(به فارسی)</i></label>

                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='name' placeholder='نام و نام خانوادگی' />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    <div className="groupInput">
                        <div className="inputForm " id='divEmail' data-lang='en'>

                            <div className='divLabel'>
                                <i class='far fa-check-circle true'></i><i class='fas fa-exclamation false'></i>
                                <label htmlFor="name">ایمیل</label>
                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='email' placeholder='ایمیل' />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    <div className="groupInput">
                        <div className="inputForm " id='divMobile' data-lang='num'>
                            <div className='divLabel'>
                                <i class='far fa-check-circle true'></i><i class='fas fa-exclamation false'></i>
                                <label htmlFor="name">موبایل </label>
                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='mobile' placeholder='موبایل' />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    <div className="groupInput">
                        <div className="inputForm " id='divPass' data-lang='en_num'>
                            <div className='divLabel'>
                                <i class='far fa-check-circle true'></i><i class='fas fa-exclamation false'></i>
                                <label htmlFor="name">رمز عبور </label>
                            </div>
                            <input type="text" onFocus={backStyle} onInput={ChangeStyle} onBlur={handleCheckValue} id='pass' placeholder='رمز عبورddids' />
                        </div>
                        <div className="errorInput"></div>
                    </div>
                    < Captcha handleCheckValue={handleCheckValue}></Captcha>
                    <input type="button" className='btnForm' id="" value='ثبت' />


                </form>
            </div>
            <div className="formLeft">
                {/* عکس قرار می گیرد */}
                image
            </div>
        </div>
    )

}


