package object

type Error struct {
	Message string
}

func (e *Error) Inspect() string {
	// msg := fmt.Sprintf("\x1b[%dm%s\x1b[0m", 31, "Kosa: ") // Nuked red formatting using ANSI escape codes
	// Shows up as weird chars on the browser 
	return "Kosa: " + e.Message
}
func (e *Error) Type() ObjectType { return ERROR_OBJ }
