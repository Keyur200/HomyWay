import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { MdLockOpen } from 'react-icons/md';
import { Input, Switch, Button } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { AuthContext } from 'context/AuthProvider';
import { FieldWrapper, SwitchWrapper, Label } from '../Auth.style';

const SignUpForm = () => {
  const { signUp, loggedIn } = useContext(AuthContext);
    const [name,setName] = useState()
    const [email,setEmail] = useState()
    const [pass,setPass] = useState()
    const [phone,setphone] = useState()
    const navigate = useNavigate()
  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });
  const handleSubmit = async (e) => {
    e.preventDefault()
    await signUp({name,email,password:pass,phone});
    navigate("/sign-in")
  };
  if (loggedIn) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl
        label="Username"
        htmlFor="username"
        // error={
        //   errors.username && (
        //     <>
        //       {errors.username?.type === 'required' && (
        //         <span>This field is required!</span>
        //       )}
        //     </>
        //   )
        // }
      >
        <Controller
          name="username"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input onChange={e=>setName(e.target.value)} onBlur={onBlur} value={name} />
          )}
        />
      </FormControl>
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
      {/* <FormControl
        label="Confirm password"
        htmlFor="confirmPassword"
        error={
          confirmPassword &&
          password !== confirmPassword && (
            <span>Your password is not same!</span>
          )
        }
      >
        <Controller
          name="confirmPassword"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input.Password onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
      </FormControl> */}
       <FormControl
        label="Phone number"
        htmlFor="phone"
        // error={
        //   errors.username && (
        //     <>
        //       {errors.username?.type === 'required' && (
        //         <span>This field is required!</span>
        //       )}
        //     </>
        //   )
        // }
      >
        <Controller
          name="phone"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input onChange={e=>setphone(e.target.value)} onBlur={onBlur} value={phone} />
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
        <SwitchWrapper>
          <Controller
            control={control}
            name="termsAndConditions"
            valueName="checked"
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Switch onChange={onChange} checked={value} />
            )}
          />
          <Label>I agree with terms and conditions</Label>
        </SwitchWrapper>
      </FieldWrapper>
      <Button
        className="signin-btn"
        type="primary"
        htmlType="submit"
        size="large"
        style={{ width: '100%' }}
      >
        <MdLockOpen />
        Register
      </Button>
    </form>
  );
};

export default SignUpForm;
