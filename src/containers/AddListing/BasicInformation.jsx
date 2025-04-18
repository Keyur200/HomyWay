import React, { useContext, useEffect } from 'react';
import { useStateMachine } from 'little-state-machine';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, InputNumber, Button } from 'antd';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import FormControl from 'components/UI/FormControl/FormControl';
import addListingAction from './AddListingAction';
import { FormHeader, Title, FormContent, FormAction } from './AddListing.style';
import { AuthContext } from '../../context/AuthProvider';

const BasicInformation = ({ setStep }) => {
  const { user } = useContext(AuthContext);
  const { actions, state } = useStateMachine({ addListingAction });
  const {
    control,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      hostId: user?.id,
      propertyName: state?.data?.propertyName,
      propertyDescription: state?.data?.propertyDescription,
      propertyAdderss: state?.data?.propertyAdderss,
      propertyCity: state?.data?.propertyCity,
      propertyState: state?.data?.propertyState,
      propertyCountry: state?.data?.propertyCountry,
      maxGuests: state?.data?.maxGuests,
      bedRoom: state?.data?.bedRoom || 0,
      bed: state?.data?.bed || 0,
      bathroom: state?.data?.bed || 0,
      status: "Pending",
      propertyPrice: state?.data?.pricePerNight || 0,
      categoryId: 1
    },
  });

  useEffect(() => {
    register('guest', { required: true });
    register('bed', { required: true });
  }, [register]);

  const handleOnChange = (key, event) => {
    actions.addListingAction({ [key]: event.target.value });
    setValue(key, event.target.value);
  };

  const handleIncrement = (key) => {
    const incrementValue = ++state.data[key];
    actions.addListingAction({ [key]: incrementValue });
    setValue(key, incrementValue);
  };

  const handleDecrement = (key) => {
    if (state.data[key] < 1) {
      return false;
    }
    const decrementValue = --state.data[key];
    actions.addListingAction({ [key]: decrementValue });
    setValue(key, decrementValue);
  };

  const onSubmit = (data) => {
    actions.addListingAction(data);
    setStep(2);
  };

  console.log('data', state);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Step 1: Start with the basics</Title>
        </FormHeader>
        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Hotel Name"
              htmlFor="hotelName"
              error={errors.hotelName && <span>This field is required!</span>}
            >
              <Controller
                name="hotelName"
                defaultValue={state?.data?.hotelName}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Write your hotel name here"
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col sm={12}>
            <FormControl
              label="Price Per Night (USD)"
              htmlFor="pricePerNight"
              error={
                errors.pricePerNight && (
                  <>
                    {errors.pricePerNight?.type === 'required' && (
                      <span>This field is required!</span>
                    )}
                    {errors.pricePerNight?.type === 'pattern' && (
                      <span>Please enter only number!</span>
                    )}
                  </>
                )
              }
            >
              <Controller
                name="pricePerNight"
                defaultValue={state?.data?.pricePerNight}
                control={control}
                rules={{
                  required: true,
                  pattern: /^[0-9]*$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputNumber
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="00.00"
                  />
                )}
              />
            </FormControl>
          </Col>
        </Row>

        <FormControl
          label="Hotel Description"
          htmlFor="hotelDescription"
          error={
            errors.hotelDescription && <span>This field is required!</span>
          }
        >
          <Controller
            name="hotelDescription"
            defaultValue={state?.data?.hotelDescription}
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input.TextArea
                rows={5}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Tell people about your hotel, room, location & amenities"
              />
            )}
          />
        </FormControl>
        <FormControl
          label="property Address"
          htmlFor="propertyAdderss"
          error={
            errors.propertyAdderss && <span>This field is required!</span>
          }
        >
          <Controller
            name="propertyAdderss"
            defaultValue={state?.data?.propertyAdderss}
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input.TextArea
                rows={5}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Tell people about your hotel, room, location & amenities"
              />
            )}
          />
        </FormControl>
        <Row gutter={30}>
          <Col sm={8}>
            <FormControl
              label="City"
              htmlFor="city"
              error={errors.hotelName && <span>This field is required!</span>}
            >
              <Controller
                name="city"
                defaultValue={state?.data?.city}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Write your hotel name here"
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col sm={8}>
            <FormControl
              label="State"
              htmlFor="state"
              error={errors.state && <span>This field is required!</span>}
            >
              <Controller
                name="hotelName"
                defaultValue={state?.data?.state}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Write your hotel name here"
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col sm={8}>
            <FormControl
              label="Country"
              htmlFor="country"
              error={errors.hotelName && <span>This field is required!</span>}
            >
              <Controller
                name="hotelName"
                defaultValue={state?.data?.country}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Write your hotel name here"
                  />
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
        <Col sm={8}>
          <FormControl
            label="How many guests can your hotel accommodate?"
            error={errors.guest && <span>This field is required!</span>}
          >
            <InputIncDec
              name="guest"
              value={state?.data?.guest}
              onChange={(e) => handleOnChange('guest', e)}
              increment={() => handleIncrement('guest')}
              decrement={() => handleDecrement('guest')}
            />
          </FormControl>
          </Col>
          <Col sm={8}>
          <FormControl
            label="How many beds can guests use?"
            error={errors.bedRoom && <span>This field is required!</span>}
          >
            <InputIncDec
              name="bed"
              value={state?.data?.bedRoom}
              onChange={(e) => handleOnChange('bedroom', e)}
              increment={() => handleIncrement('bedroom')}
              decrement={() => handleDecrement('bedroom')}
            />
          </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
        <Col sm={8}>
          <FormControl
            label="How many guests can your hotel accommodate?"
            error={errors.bed && <span>This field is required!</span>}
          >
            <InputIncDec
              name="guest"
              value={state?.data?.bed}
              onChange={(e) => handleOnChange('bed', e)}
              increment={() => handleIncrement('bed')}
              decrement={() => handleDecrement('bed')}
            />
          </FormControl>
          </Col>
          <Col sm={8}>
          <FormControl
            label="How many beds can guests use?"
            error={errors.bathroom && <span>This field is required!</span>}
          >
            <InputIncDec
              name="bed"
              value={state?.data?.bathroom}
              onChange={(e) => handleOnChange('bathroom', e)}
              increment={() => handleIncrement('bathroom')}
              decrement={() => handleDecrement('bathroom')}
            />
          </FormControl>
          </Col>
        </Row>
      </FormContent>
      <FormAction>
        <div className="inner-wrapper">
          <Button htmlType="submit">Next</Button>
        </div>
      </FormAction>
    </form>
  );
};

export default BasicInformation;
