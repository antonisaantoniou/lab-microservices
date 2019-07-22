export class CustomError extends Error{

    public fieldError: string;

    constructor(field: string, message: string) {
        super(message);
        this.fieldError = field;
        return this;
    }

}