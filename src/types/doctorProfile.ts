export interface DoctorProfileRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  hospitalName: string;
  title: string;
}

export interface DoctorProfileResponseDto extends DoctorProfileRequestDto {
  doctorUserId: number;
}