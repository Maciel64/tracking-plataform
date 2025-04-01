"use client";

import { Moon, Sun, Monitor } from "lucide-react"; // Adicionei o ícone de sistema
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // Mapeamento seguro de temas
  const themes = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Alternar tema">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <div className="p-4">
          <Label className="text-sm font-medium">Tema</Label>
          <RadioGroup
            value={theme}
            onValueChange={setTheme} // Já é uma função (não precisa de wrapper)
            className="mt-2 space-y-2"
          >
            {themes.map(({ value, label, icon: Icon }) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={value} />
                <Label
                  htmlFor={value}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}