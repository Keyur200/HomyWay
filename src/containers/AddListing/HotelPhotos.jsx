import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
import FormControl from 'components/UI/FormControl/FormControl';
import addListingAction from './AddListingAction';
import { FormHeader, Title, FormContent, FormAction } from './AddListing.style';

const hotelPhotos = [
  {
    uid: '1',
    name: 'hotel-1.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '2',
    name: 'hotel-2.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '3',
    name: 'hotel-3.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];

const HotelPhotos = ({ setStep }) => {
  const { actions, state } = useStateMachine({ addListingAction });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: { images: state?.data?.images || [] },
  });

  useEffect(() => {
    register('images', { required: true });
  }, [register]);

  const onSubmit = (data) => {
    actions.addListingAction(data);
    setStep(3);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Step 2: Hotel Photos</Title>
        </FormHeader>
        <FormControl
          error={errors.images && <span>This field is required!</span>}
        >
          <input type="file" multiple onChange={(e) => setValue("images", [...e.target.files])} />
          {errors.images && <span>{errors.images.message}</span>}
        </FormControl>
      </FormContent>
      <FormAction>
        <div className="inner-wrapper">
          <Button
            className="back-btn"
            htmlType="button"
            onClick={() => setStep(1)}
          >
            <IoIosArrowBack /> Back
          </Button>
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

// const HotelPhotos = ({ setStep }) => {
//   const { actions, state } = useStateMachine({ addListingAction });
//   const { register, setValue, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: { hotelPhotos: state?.data?.hotelPhotos || [] },
//   });

//   useEffect(() => {
//     register("hotelPhotos", { required: "Please upload at least one photo!" });
//   }, [register]);

//   const onSubmit = (data) => {
//     actions.addListingAction(data);
//     setStep(3);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <h2>Step 2: Hotel Photos</h2>
//       <input type="file" multiple onChange={(e) => setValue("hotelPhotos", [...e.target.files])} />
//       {errors.hotelPhotos && <span>{errors.hotelPhotos.message}</span>}
//       <button type="button" onClick={() => setStep(1)}>Back</button>
//       <button type="submit">Next</button>
//     </form>
//   );
// };
export default HotelPhotos;
