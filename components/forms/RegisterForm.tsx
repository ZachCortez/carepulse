"use client"
 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField"; 
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import PatientForm, { FormFieldType } from "./PatientForm";




 
const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
  
    const form = useForm<z.infer<typeof PatientForm>>({
      resolver: zodResolver(PatientForm),
      defaultValues: {
        ...PatientForm,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  
    const onSubmit = async (values: z.infer<typeof PatientForm>) => {
      setIsLoading(true);
  
      // Store file info in form data as
      let formData;
      if (
        values.identificationDocument &&
        values.identificationDocument?.length > 0
      ) {
        const blobFile = new Blob([values.identificationDocument[0]], {
          type: values.identificationDocument[0].type,
        });
  
        formData = new FormData();
        formData.append("blobFile", blobFile);
        formData.append("fileName", values.identificationDocument[0].name);
      }
  
      try {
        const patient = {
          userId: user.$id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          birthDate: new Date(values.birthDate),
          gender: values.gender,
          address: values.address,
          occupation: values.occupation,
          emergencyContactName: values.emergencyContactName,
          emergencyContactNumber: values.emergencyContactNumber,
          primaryPhysician: values.primaryPhysician,
          insuranceProvider: values.insuranceProvider,
          insurancePolicyNumber: values.insurancePolicyNumber,
          allergies: values.allergies,
          currentMedication: values.currentMedication,
          familyMedicalHistory: values.familyMedicalHistory,
          pastMedicalHistory: values.pastMedicalHistory,
          identificationType: values.identificationType,
          identificationNumber: values.identificationNumber,
          identificationDocument: values.identificationDocument
            ? formData
            : undefined,
          privacyConsent: values.privacyConsent,
        };
  
        const newPatient = await registerPatient(patient);
  
        if (newPatient) {
          router.push(`/patients/${user.$id}/new-appointment`);
        }
      } catch (error) {
        console.log(error);
      }
  
      setIsLoading(false);
    };
    
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1>🧑‍⚕️Hi there!</h1>
            <p>Schedule your first appointment.🩺</p> 
        </section>
        
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="JohnDoe@email.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />

        <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
        />

      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm