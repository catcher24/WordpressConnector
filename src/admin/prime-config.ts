import { PrimeReactPTOptions } from "primereact/api";
import { DropdownPassThroughMethodOptions } from "primereact/dropdown";
import { CheckboxPassThroughMethodOptions } from "primereact/checkbox";
import { RadioButtonPassThroughMethodOptions } from "primereact/radiobutton";
import { ButtonPassThroughMethodOptions } from "primereact/button";
import { AvatarPassThroughMethodOptions } from "primereact/avatar";
import { InputTextPassThroughMethodOptions } from "primereact/inputtext";
import { MessagePassThroughMethodOptions } from "primereact/message";
import { MessagesPassThroughMethodOptions } from "primereact/messages";
import Tailwind from "primereact/passthrough/tailwind";
import { classNames } from "primereact/utils";
import { PanelPassThroughMethodOptions } from "primereact/panel";

export const CustomTailwind: PrimeReactPTOptions = {
  ...Tailwind,
  avatar: {
    root: ({ props, state }: AvatarPassThroughMethodOptions) => ({
      className: classNames(
        "flex items-center justify-center",
        "bg-gray-300 ",
        {
          "rounded-lg": props.shape == "square",
          "rounded-full": props.shape == "circle"
        },
        {
          "text-base h-8 w-8": props.size == null || props.size == "normal",
          "w-12 h-12 text-xl": props.size == "large",
          "w-16 h-16 text-2xl": props.size == "xlarge"
        },
        {
          "-ml-4 border-2 border-white ":
          state.isNestedInAvatarGroup
        }
      )
    }),
    image: {
      className: "h-full w-full"
    }
  },
  card: {
    root: {
      className: classNames(
        "bg-white text-gray-700 shadow-card rounded-md", // Background, text color, box shadow, and border radius.
        "" //dark
      )
    },
    body: {
      className: "p-5"
    } // Padding.
  },
  button: {
    root: ({ props, context }: ButtonPassThroughMethodOptions) => ({
      className: classNames(
        "items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom flex gap-2",
        "transition duration-200 ease-in-out",
        "focus:outline-none focus:outline-offset-0",
        {
          "text-white bg-primary border border-primary hover:bg-primary-light hover:border-primary-light focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(157,193,251,1),0_1px_2px_0_rgba(0,0,0,1)] ":
            !props.link &&
            props.severity === null &&
            !props.text &&
            !props.outlined &&
            !props.plain,
          "text-primary-light bg-transparent border-transparent focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(157,193,251,1),0_1px_2px_0_rgba(0,0,0,1)] ":
          props.link
        },
        {
          "focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(176,185,198,1),0_1px_2px_0_rgba(0,0,0,1)] ":
            props.severity === "secondary",
          "focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(136,234,172,1),0_1px_2px_0_rgba(0,0,0,1)] ":
            props.severity === "success",
          "focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(157,193,251,1),0_1px_2px_0_rgba(0,0,0,1)] ":
            props.severity === "info",
          "focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(250,207,133,1),0_1px_2px_0_rgba(0,0,0,1)] ":
            props.severity === "warning",
          "focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(212,170,251,1),0_1px_2px_0_rgba(0,0,0,1)] ":
            props.severity === "help",
          "focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(247,162,162,1),0_1px_2px_0_rgba(0,0,0,1)] ":
            props.severity === "danger"
        },
        {
          "text-white bg-gray-500 border border-gray-500 hover:bg-gray-600 hover:border-gray-600 ":
            props.severity === "secondary" &&
            !props.text &&
            !props.outlined &&
            !props.plain,
          "text-white bg-success border border-success hover:bg-success-light hover:border-success-light ":
            props.severity === "success" &&
            !props.text &&
            !props.outlined &&
            !props.plain,
          "text-white bg-primary border border-primary hover:bg-primary-light hover:border-primary-light ":
            props.severity === "info" &&
            !props.text &&
            !props.outlined &&
            !props.plain,
          "text-white bg-warning border border-warning hover:bg-warning-light hover:border-warning-light ":
            props.severity === "warning" &&
            !props.text &&
            !props.outlined &&
            !props.plain,
          "text-white bg-info border border-info hover:bg-info-light hover:border-info-light ":
            props.severity === "help" &&
            !props.text &&
            !props.outlined &&
            !props.plain,
          "text-white bg-danger border border-danger hover:bg-danger-light hover:border-danger-light ":
            props.severity === "danger" &&
            !props.text &&
            !props.outlined &&
            !props.plain
        },
        { "shadow-lg": props.raised },
        { "rounded-md": !props.rounded, "rounded-full": props.rounded },
        {
          "bg-transparent border-transparent": props.text && !props.plain,
          "text-primary hover:bg-blue-300/20":
            props.text &&
            (props.severity === null || props.severity === "info") &&
            !props.plain,
          "text-gray-500 hover:bg-gray-300/20":
            props.text && props.severity === "secondary" && !props.plain,
          "text-success hover:bg-green-300/20":
            props.text && props.severity === "success" && !props.plain,
          "text-warning hover:bg-orange-300/20":
            props.text && props.severity === "warning" && !props.plain,
          "text-info hover:bg-purple-300/20":
            props.text && props.severity === "help" && !props.plain,
          "text-danger hover:bg-red-300/20":
            props.text && props.severity === "danger" && !props.plain
        },
        { "shadow-lg": props.raised && props.text },
        {
          "text-gray-500 hover:bg-gray-300/20": props.plain && props.text,
          "text-gray-500 border border-gray-500 hover:bg-gray-300/20":
            props.plain && props.outlined,
          "text-white bg-gray-500 border border-gray-500 hover:bg-gray-600 hover:border-gray-600":
            props.plain && !props.outlined && !props.text
        },
        {
          "bg-transparent border": props.outlined && !props.plain,
          "text-primary border border-primary hover:bg-blue-300/20":
            props.outlined &&
            (props.severity === null || props.severity === "info") &&
            !props.plain,
          "text-gray-500 border border-gray-500 hover:bg-gray-300/20":
            props.outlined && props.severity === "secondary" && !props.plain,
          "text-success border border-success hover:bg-green-300/20":
            props.outlined && props.severity === "success" && !props.plain,
          "text-warning border border-warning hover:bg-orange-300/20":
            props.outlined && props.severity === "warning" && !props.plain,
          "text-info border border-info hover:bg-purple-300/20":
            props.outlined && props.severity === "help" && !props.plain,
          "text-danger border border-danger hover:bg-red-300/20":
            props.outlined && props.severity === "danger" && !props.plain
        },
        {
          "px-3 py-1.5 text-base": props.size === null,
          "text-xs py-2 px-3": props.size === "small",
          "text-xl py-3 px-4": props.size === "large"
        },
        { "flex-column": props.iconPos == "top" || props.iconPos == "bottom" },
        { "opacity-60 pointer-events-none cursor-default": context.disabled }
      )
    })
  },
  radiobutton: {
    root: {
      className: classNames(
        "relative inline-flex cursor-pointer select-none align-bottom",
        "w-6 h-6"
      )
    },
    input: {
      className: classNames(
        "absolute appearance-none top-0 left-0 size-full p-0 m-0 opacity-0 z-10 outline-none cursor-pointer"
      )
    },
    box: ({ props }: RadioButtonPassThroughMethodOptions) => ({
      className: classNames(
        "flex justify-center items-center",
        "border-2 w-6 h-6 text-gray-700 rounded-full transition duration-200 ease-in-out",
        {
          "border-gray-300 bg-white ":
            !props.checked,
          "border-primary bg-primary ":
          props.checked
        },
        {
          "hover:border-primary focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] ":
            !props.disabled,
          "cursor-default opacity-60": props.disabled
        }
      )
    }),
    icon: ({ props }: RadioButtonPassThroughMethodOptions) => ({
      className: classNames(
        "transform rounded-full",
        "block w-3 h-3 transition duration-200 bg-white ",
        {
          "backface-hidden scale-10 invisible": !props.checked,
          "transform scale-100 visible": props.checked
        }
      )
    })
  },
  checkbox: {
    root: {
      className: classNames(
        "cursor-pointer inline-flex relative select-none align-bottom",
        "w-6 h-6"
      )
    },
    input: {
      className: classNames(
        "absolute appearance-none top-0 left-0 size-full p-0 m-0 opacity-0 z-10 outline-none cursor-pointer"
      )
    },
    box: ({ props, context }: CheckboxPassThroughMethodOptions) => ({
      className: classNames(
        "flex items-center justify-center",
        "border-2 w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200",
        {
          "border-gray-300 bg-white ":
            !context.checked,
          "border-primary bg-primary ":
          context.checked
        },
        {
          "hover:border-primary focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] ":
            !props.disabled,
          "cursor-default opacity-60": props.disabled
        }
      )
    }),
    icon: {
      className: classNames(
        "w-4 h-4 transition-all duration-200 text-white text-base "
      )
    }
  },
  password: {
    input: {
      className: classNames("m-0 w-full")
    }
  },
  dropdown: {
    root: ({ props }: DropdownPassThroughMethodOptions) => ({
      className: classNames(
        "cursor-pointer inline-flex relative select-none",
        "bg-white border border-gray-300 transition-colors duration-200 ease-in-out rounded-md",
        "",
        "w-full",
        "hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] ",
        {
          "opacity-60 select-none pointer-events-none cursor-default":
          props.disabled
        }
      )
    }),
    input: ({ props }: DropdownPassThroughMethodOptions) => ({
      className: classNames(
        "cursor-pointer block flex flex-auto overflow-hidden overflow-ellipsis whitespace-nowrap relative",
        "bg-transparent border-0 text-gray-800",
        "",
        "p-2 transition duration-200 bg-transparent rounded appearance-none font-sans text-sm",
        "focus:outline-none focus:shadow-none",
        { "pr-7": props.showClear }
      )
    }),
    trigger: {
      className: classNames(
        "flex items-center justify-center shrink-0",
        "bg-transparent text-gray-500 w-12 rounded-tr-lg rounded-br-lg"
      )
    },
    wrapper: {
      className: classNames(
        "max-h-[200px] overflow-auto",
        "bg-white text-gray-700 border-0 rounded-md shadow-lg",
        ""
      )
    },
    list: {
      className: classNames("py-3 list-none m-0")
    },
    item: ({ context }: DropdownPassThroughMethodOptions) => ({
      className: classNames(
        "cursor-pointer font-normal overflow-hidden relative whitespace-nowrap",
        "m-0 p-3 border-0  transition-shadow duration-200 rounded-none",
        "",
        "hover:text-gray-700 hover:bg-gray-200",
        {
          "text-gray-700": !context.focused && !context.selected,
          "bg-gray-300 text-gray-700 ":
            context.focused && !context.selected,
          "bg-blue-400 text-blue-700 ":
            context.focused && context.selected,
          "bg-blue-50 text-blue-700 ":
            !context.focused && context.selected,
          "opacity-60 select-none pointer-events-none cursor-default":
          context.disabled
        }
      )
    })
  },
  inputtext: {
    root: ({ props, context }: InputTextPassThroughMethodOptions) => ({
      className: classNames(
        "m-0 w-full",
        "font-sans text-gray-600 bg-white border border-gray-300 transition-colors duration-200 appearance-none rounded-lg",
        {
          "hover:border-primary focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] ":
            !context.disabled,
          "opacity-60 select-none pointer-events-none cursor-default":
          context.disabled
        },
        {
          "text-base px-3 py-3": props.size == "large",
          "text-xs px-1 py-1": props.size == "small",
          "p-2 text-sm": props.size == null
        }
      )
    })
  },
  message: {
    root: ({ props }: MessagePassThroughMethodOptions) => ({
      className: classNames(
        "inline-flex items-center justify-center align-top text-sm",
        "p-3 m-0 rounded-md",
        {
          "bg-info-lighter border-solid border border-info text-info":
            props.severity == "info",
          "bg-success-lighter border-solid border border-success text-success":
            props.severity == "success",
          "bg-warning-lighter border-solid border border-warning text-warning":
            props.severity == "warn",
          "bg-danger-lighter border-solid border border-danger text-danger":
            props.severity == "error"
        }
      )
    })
  },
  messages: {
    root: ({ state, index }: MessagesPassThroughMethodOptions) => {
      return {
        className: classNames("my-4 rounded-md text-sm", {
          "bg-info-light border-solid border border-info text-info":
            state.messages[index ?? 0] &&
            state.messages[index ?? 0].message.severity == "info",
          "bg-success-light border-solid border border-success text-success":
            state.messages[index ?? 0] &&
            state.messages[index ?? 0].message.severity == "success",
          "bg-warning-light border-solid border border-warning text-warning":
            state.messages[index ?? 0] &&
            state.messages[index ?? 0].message.severity == "warn",
          "bg-danger-light border-solid border border-danger text-danger":
            state.messages[index ?? 0] &&
            state.messages[index ?? 0].message.severity == "error"
        })
      };
    }
  },
  panel: {
    header: ({ props }: PanelPassThroughMethodOptions) => ({
        className: classNames(
            'flex items-center justify-between', // flex and alignments
            'border border-gray-300 text-gray-700 rounded-tl-lg rounded-tr-lg', // borders and colors
            'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80', // Dark mode
            { 'p-5': !props.toggleable, 'py-3 px-5': props.toggleable } // condition
        )
    }),
    title: {
      className: "font-bold leading-none"
    },
    toggler: {
      className: classNames(
        "inline-flex items-center justify-center overflow-hidden relative no-underline",
        "w-8 h-8 text-secondary border-0 bg-transparent rounded-full transition duration-200 ease-in-out",
        "hover:text-secondary-darker hover:bg-tertiary-light dark:hover:text-white dark:hover:bg-tertiary-dark",
        "focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]"
      )
    },
    content: {
      className: classNames(
        "p-5 border border-t-0 border-secondary-light bg-white text-secondary-dark rounded-b-lg",
        "dark:bg-secondary-darker dark:border-secondary-dark dark:text-white"
      )
    }
  }
};
