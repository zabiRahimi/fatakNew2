<?php

namespace App\Http\Controllers\Api\Web\Auth\User;



use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Rules\Name;
use App\Rules\Mobile;
use App\Rules\Pass;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    // protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('guest:shop');
        $this->middleware('guest');
    }

   
   

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $this->validator($request->all())->validate();

        // event(new Registered($user = $this->create($request->all())));

        // // $this->guard('shop')->login($user);

        // // return $this->registered($request, $user)
        // //                 ?: redirect($this->redirectPath());
        // return $this->registered($request, $user)
        //                 ?: response()->json(['user'=> $user]);
    }

   

    /**
     * The user has been registered.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function registered(Request $request, $user)
    {
        //
    }
    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        (!empty($data['id']))? $id=',' . $data['id'] : $id=',';
        return Validator::make($data, [
          'name'=>['sometimes' , 'required' , 'min:3' , new Name ],
          'mobile'=>['sometimes' , 'required' ,new Mobile, 'unique:users,mobile'. $id],
          'pass'=>['sometimes' , 'required' , new Pass ],
          'email'=>['sometimes' , 'required' , 'email' , 'unique:users,email' . $id],
          'captcha'=>['sometimes' , 'required' , 'captcha'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        return User::create([
            // 'shop' => $data['shop'],
            'name' => $data['name'],
            'lastName' => $data['lastName'],
            'mobile' => $data['mobile'],
            // 'email' => $data['email'],
            'pass' => Hash::make($data['pass']),
            'date_ad' => time(),
            'date_up' => time(),
            'stage'=>'1',
            'show' => '1',
        ]);
    }
}
