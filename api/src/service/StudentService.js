const { Student } = require('../db/models');
const AppError = require('../shared/errors/AppError');
const validateEmail = require('../shared/utils/validateEmail');
const validateCPF = require('../shared/utils/validateCPF');

module.exports = {
  async listStudents() {
    const students = await Student.findAll();
    if (students.length === 0) {
      throw new AppError('Não há alunos cadastrados.', 404);
    }
    return students;
  },
  async findStudent(id) {
    const student = await Student.findOne({ where: { id } });
    if (!student) {
      throw new AppError('Aluno não encontrado.', 404);
    }
    return student;
  },
  async updateStudent(id, inputData) {
    const student = await Student.findOne({ where: { id: id } });

    if (!student) {
      throw new AppError('Aluno não encontrado.', 404);
    }

    inputData.RA = student.RA;
    inputData.CPF = student.CPF;
    this.inputValidator(inputData);

    student.name = inputData.name;
    student.email = inputData.email;
    await student.save({ fields: ['name', 'email'] });
  },
  async createStudent(inputData) {
    this.inputValidator(inputData);

    const student = await Student.create(inputData);

    return student;
  },
  inputValidator(data) {
    const { name, email, CPF } = data;
    if (!name) {
      throw new AppError('Favor informar o campo nome.', 400);
    }

    if (name && name.length > 60) {
      throw new AppError(
        'O campo nome deve ser deve ter no máximo 60 caracteres.',
        400
      );
    }

    if (!email) {
      throw new AppError('Favor informar o campo e-mail.', 400);
    }

    if (!validateEmail(email)) {
      throw new AppError('Favor informar um e-mail váildo.', 400);
    }

    if (!CPF) {
      throw new AppError('Favor informar o campo CPF.', 400);
    }

    if (!validateCPF(CPF)) {
      throw new AppError('Favor informar um CPF válido.', 400);
    }
  },
};
