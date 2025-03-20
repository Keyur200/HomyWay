import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { MdLockOpen } from 'react-icons/md';
import { Input, Switch, Button } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { AuthContext } from 'context/AuthProvider';
import { FORGET_PASSWORD_PAGE } from 'settings/constant';
import { FieldWrapper, SwitchWrapper, Label } from '../Auth.style';
import axios from 'axios';

export default function SignInForm() {
  const { signIn, loggedIn } = useContext(AuthContext);

  const [email,setEmail] = useState()
  const [pass,setPass] = useState()

  const {
    control,
    formState: { errors },
  } = useForm();
  const handleSubmit = async (e) => {
    e.preventDefault()
    await signIn({email,password:pass})
  };
  if (loggedIn) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl
        label="Email"
        htmlFor="email"
        // error={
        //   errors.email && (
        //     <>
        //       {errors.email?.type === 'required' && (
        //         <span>This field is required!</span>
        //       )}
        //       {errors.email?.type === 'pattern' && (
        //         <span>Please enter a valid email address!</span>
        //       )}
        //     </>
        //   )
        // }
      >
        <Controller
          name="email"
          defaultValue=""
          control={control}
          rules={{
            required: true,
            pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              type="email"
              onChange={e=>setEmail(e.target.value)}
              onBlur={onBlur}
              value={email}
            />
          )}
        />
      </FormControl>
      <FormControl
        label="Password"
        htmlFor="password"
        // error={
        //   errors.password && (
        //     <>
        //       {errors.password?.type === 'required' && (
        //         <span>This field is required!</span>
        //       )}
        //       {errors.password?.type === 'minLength' && (
        //         <span>Password must be at lest 6 characters!</span>
        //       )}
        //       {errors.password?.type === 'maxLength' && (
        //         <span>Password must not be longer than 20 characters!</span>
        //       )}
        //     </>
        //   )
        // }
      >
        <Controller
          name="password"
          defaultValue=""
          control={control}
          rules={{ required: true, minLength: 6, maxLength: 20 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input.Password onChange={e=>setPass(e.target.value)} onBlur={onBlur} value={pass} />
          )}
        />
      </FormControl>
      <FieldWrapper>
        <SwitchWrapper>
          <Controller
            control={control}
            name="rememberMe"
            valueName="checked"
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Switch onChange={onChange} checked={value} />
            )}
          />
          <Label>Remember Me</Label>
        </SwitchWrapper>
        <Link to={FORGET_PASSWORD_PAGE}>Forget Password ?</Link>
      </FieldWrapper>
      <Button
        className="signin-btn"
        type="primary"
        htmlType="submit"
        size="large"
        style={{ width: '100%' }}
      >
        <MdLockOpen />
        Login
      </Button>
    </form>
  );
}
