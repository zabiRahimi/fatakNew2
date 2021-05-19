<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CaptchaController extends Controller
{
    public function refreshCaptcha()
    {
      return response()->json(['captchaSrc'=> captcha_src()]);
       //  return  captcha_img();
    }
}
