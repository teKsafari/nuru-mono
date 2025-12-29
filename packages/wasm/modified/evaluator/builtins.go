// Modified version with of the builtins.go file with browser friendly functions.
// Original file is located at: https://github.com/NuruProgramming/Nuru/blob/main/evaluator/builtins.go
package evaluator

import (
	// "bufio"
	"fmt"
	// "io"
	"os"
	"strings"

	"github.com/NuruProgramming/Nuru/object"
	"syscall/js"
)

// func newError(format string, a ...interface{}) *object.Error {
// 	return &object.Error{Message: fmt.Sprintf(format, a...)}
// }

var builtins = map[string]*object.Builtin{
	"jaza": {
		Fn: func(args ...object.Object) object.Object {

			if len(args) > 1 {
				return newError("Samahani, kiendesha hiki kinapokea hoja 0 au 1, wewe umeweka %d", len(args))
			}

			if len(args) > 0 && args[0].Type() != object.STRING_OBJ {
				return newError(fmt.Sprintf(`Tafadhali tumia alama ya nukuu: "%s"`, args[0].Inspect()))
			}
			if len(args) == 1 {
				// prompt := args[0].(*object.String).Value
				// prompt += "\n" //add breakline
				fmt.Println("prompt")
			} else {
				fmt.Println("Nooo")
			}

			// Get the window.prompt function
			jsPromptFunction := js.Global().Get("prompt")
			if jsPromptFunction.Type() != js.TypeFunction {
				// fmt.Print("prompt function not found")
				return newError("prompt function not found")
			}

			// invoke it!!
			result := jsPromptFunction.Invoke(args[0].Inspect())

			// fmt.Println("the arguments", args[0].Inspect())
			// fmt.Println("the result of window.prompt", result.String())

			// buffer := bufio.NewReader(os.Stdin)

			// line, _, err := buffer.ReadLine()

			if result.String() == ""|| result.String() == "null" {
				return newError("Nimeshindwa kusoma uliyo yajaza")
			}

			return &object.String{Value: string(result.String())}
		},
	},
	"andika": {
		Fn: func(args ...object.Object) object.Object {
			jsOutputReceiverFunction := js.Global().Get("nuruOutputReceiver")
			if len(args) == 0 {
				jsOutputReceiverFunction.Invoke("")
			} else {
				var arr []string
				for _, arg := range args {
					if arg == nil {
						return newError("Hauwezi kufanya operesheni hii")
					}
					arr = append(arr, arg.Inspect())
				}
				str := strings.Join(arr, " ")
				// fmt.Println(str)  // removed Print to console
				// return &object.String{Value: str} // return the output
				jsOutputReceiverFunction.Invoke(str)	
			}
			return nil
		},
	},

	// removed the _andika function since andika now returns the output

	// "_andika": {
	// 	Fn: func(args ...object.Object) object.Object {
	// 		if len(args) == 0 {
	// 			return &object.String{Value: "\n"}
	// 		} else {
	// 			var arr []string
	// 			for _, arg := range args {
	// 				if arg == nil {
	// 					return newError("Hauwezi kufanya operesheni hii")
	// 				}
	// 				arr = append(arr, arg.Inspect())
	// 			}
	// 			str := strings.Join(arr, " ")
	// 			return &object.String{Value: str}
	// 		}
	// 	},
	// },
	"aina": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("Samahani, tunahitaji hoja 1, wewe umeweka %d", len(args))
			}

			return &object.String{Value: string(args[0].Type())}
		},
	},
	"fungua": {
		Fn: func(args ...object.Object) object.Object {

			if len(args) != 1 {
				return newError("Samahani, tunahitaji hoja 1, wewe umeweka %d", len(args))
			}
			filename := args[0].(*object.String).Value

			file, err := os.ReadFile(filename)
			if err != nil {
				return &object.Error{Message: "Tumeshindwa kusoma faili"}
			}
			return &object.File{Filename: filename, Content: string(file)}
		},
	},
	"mfululizo": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) < 1 || len(args) > 3 {
				return newError("Samahani, mfululizo inahitaji hoja 1 hadi 3, wewe umeweka %d", len(args))
			}

			var start, end, step int64
			var err error

			switch len(args) {
			case 1:
				end, err = getIntValue(args[0])
				if err != nil {
					return newError("Hoja lazima iwe nambari nzima")
				}
				start, step = 0, 1
			case 2:
				start, err = getIntValue(args[0])
				if err != nil {
					return newError("Hoja ya kwanza lazima iwe nambari nzima")
				}
				end, err = getIntValue(args[1])
				if err != nil {
					return newError("Hoja ya pili lazima iwe nambari nzima")
				}
				step = 1
			case 3:
				start, err = getIntValue(args[0])
				if err != nil {
					return newError("Hoja ya kwanza lazima iwe nambari nzima")
				}
				end, err = getIntValue(args[1])
				if err != nil {
					return newError("Hoja ya pili lazima iwe nambari nzima")
				}
				step, err = getIntValue(args[2])
				if err != nil {
					return newError("Hoja ya tatu lazima iwe nambari nzima")
				}
				if step == 0 {
					return newError("Hatua haiwezi kuwa sifuri")
				}
			}

			elements := []object.Object{}
			for i := start; (step > 0 && i < end) || (step < 0 && i > end); i += step {
				elements = append(elements, &object.Integer{Value: i})
			}

			return &object.Array{Elements: elements}
		},
	},
	"namba": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("Samahani, namba inahitaji hoja 1, wewe umeweka %d", len(args))
			}
			value := args[0]
			return convertToInteger(value)
		},
	},
	"tungo": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("Samahani, tungo inahitaji hoja 1, wewe umeweka %d", len(args))
			}
			value := args[0]
			return convertToString(value)
		},
	},

	// "jumla": {
	// 	Fn: func(args ...object.Object) object.Object {
	// 		if len(args) != 1 {
	// 			return newError("Hoja hazilingani, tunahitaji=1, tumepewa=%d", len(args))
	// 		}

	// 		switch arg := args[0].(type) {
	// 		case *object.Array:

	// 			var sums float64
	// 			for _, num := range arg.Elements {

	// 				if num.Type() != object.INTEGER_OBJ && num.Type() != object.FLOAT_OBJ {
	// 					return newError("Samahani namba tu zinahitajika")
	// 				} else {
	// 					if num.Type() == object.INTEGER_OBJ {
	// 						no, _ := strconv.Atoi(num.Inspect())
	// 						floatnum := float64(no)
	// 						sums += floatnum
	// 					} else if num.Type() == object.FLOAT_OBJ {
	// 						no, _ := strconv.ParseFloat(num.Inspect(), 64)
	// 						sums += no
	// 					}

	// 				}
	// 			}

	// 			if math.Mod(sums, 1) == 0 {
	// 				return &object.Integer{Value: int64(sums)}
	// 			}

	// 			return &object.Float{Value: float64(sums)}

	// 		default:
	// 			return newError("Samahani, hii function haitumiki na %s", args[0].Type())
	// 		}
	// 	},
	// },
}

func getIntValue(obj object.Object) (int64, error) {
	switch obj := obj.(type) {
	case *object.Integer:
		return obj.Value, nil
	default:
		return 0, fmt.Errorf("expected integer, got %T", obj)
	}
}
