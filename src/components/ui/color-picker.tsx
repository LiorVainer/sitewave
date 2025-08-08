'use client'

import * as React from 'react'
import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {PipetteIcon} from 'lucide-react'

// Utility function
const cn_util = (...classes: (string | undefined | null | boolean)[]) => {
    return classes.filter(Boolean).join(' ')
}

// Color utility functions
function hslToHex(h: number, s: number, l: number): string {
    l /= 100
    s /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1))
    return (
        '#' +
        [f(0), f(8), f(4)]
            .map(x =>
                Math.round(x * 255)
                    .toString(16)
                    .padStart(2, '0')
            )
            .join('')
    )
}

function hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }

    return [h * 360, s * 100, l * 100]
}

// Context for color picker state
interface ColorPickerContextValue {
    hue: number
    saturation: number
    lightness: number
    alpha: number
    mode: string
    setHue: (hue: number) => void
    setSaturation: (saturation: number) => void
    setLightness: (lightness: number) => void
    setAlpha: (alpha: number) => void
    setMode: (mode: string) => void
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(undefined)

export const useColorPicker = () => {
    const context = useContext(ColorPickerContext)
    if (!context) {
        throw new Error('useColorPicker must be used within a ColorPickerProvider')
    }
    return context
}

// Main ColorPicker component
export interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
}

export const ColorPicker = ({
                                value,
                                defaultValue = '#3b82f6',
                                onChange,
                                className,
                                ...props
                            }: ColorPickerProps) => {
    const initialColor = value || defaultValue
    const [h, s, l] = hexToHsl(initialColor)

    const [hue, setHue] = useState(h)
    const [saturation, setSaturation] = useState(s)
    const [lightness, setLightness] = useState(l)
    const [alpha, setAlpha] = useState(100)
    const [mode, setMode] = useState('hex')

    // Update color when controlled value changes
    useEffect(() => {
        if (value) {
            const [h, s, l] = hexToHsl(value)
            setHue(h)
            setSaturation(s)
            setLightness(l)
        }
    }, [value])

    // Notify parent of changes
    useEffect(() => {
        if (onChange) {
            const color = hslToHex(hue, saturation, lightness)
            onChange(color)
        }
    }, [hue, saturation, lightness, onChange])

    return (
        <ColorPickerContext.Provider
            value={{
                hue,
                saturation,
                lightness,
                alpha,
                mode,
                setHue,
                setSaturation,
                setLightness,
                setAlpha,
                setMode,
            }}
        >
            <div className={cn_util('grid w-full gap-4', className)} {...props}>
                <ColorPickerSelection />
                <div className="flex items-center gap-4">
                    <div
                        className='aspect-square h-full rounded-lg border-2 border-border shadow-sm z-50'
                        style={{ backgroundColor: value }}
                    />
                    <div className="w-full grid gap-1">
                        <ColorPickerHue />
                        <ColorPickerAlpha />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ColorPickerOutput />
                    <ColorPickerFormat />
                </div>
            </div>
        </ColorPickerContext.Provider>
    )
}

// Color selection area component
export const ColorPickerSelection = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
    const { hue, setSaturation, setLightness } = useColorPicker()

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            if (!isDragging || !containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()
            const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
            const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))

            setPosition({ x, y })
            setSaturation(x * 100)
            setLightness((1 - y) * 100)
        },
        [isDragging, setSaturation, setLightness]
    )

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('pointermove', handlePointerMove)
            window.addEventListener('pointerup', () => setIsDragging(false))
        }
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', () => setIsDragging(false))
        }
    }, [isDragging, handlePointerMove])

    return (
        <div
            ref={containerRef}
            className={cn_util('relative aspect-[4/3] w-full cursor-crosshair rounded', className)}
            style={{
                background: `linear-gradient(0deg,rgb(0,0,0),transparent),linear-gradient(90deg,rgb(255,255,255),hsl(${hue},100%,50%))`,
            }}
            onPointerDown={(e) => {
                e.preventDefault()
                setIsDragging(true)
                handlePointerMove(e.nativeEvent)
            }}
            {...props}
        >
            <div
                className="absolute h-4 w-4 rounded-full border-2 border-white pointer-events-none"
                style={{
                    left: `${position.x * 100}%`,
                    top: `${position.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
                }}
            />
        </div>
    )
}

// Hue slider component
export const ColorPickerHue = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const { hue, setHue } = useColorPicker()
    const [isDragging, setIsDragging] = useState(false)
    const sliderRef = useRef<HTMLDivElement>(null)

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            if (!isDragging || !sliderRef.current) return

            const rect = sliderRef.current.getBoundingClientRect()
            const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
            setHue(x * 360)
        },
        [isDragging, setHue]
    )

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('pointermove', handlePointerMove)
            window.addEventListener('pointerup', () => setIsDragging(false))
        }
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', () => setIsDragging(false))
        }
    }, [isDragging, handlePointerMove])

    return (
        <div
            ref={sliderRef}
            className={cn_util('relative flex h-4 w-full touch-none cursor-pointer', className)}
            onPointerDown={(e) => {
                e.preventDefault()
                setIsDragging(true)
                handlePointerMove(e.nativeEvent)
            }}
            {...props}
        >
            <div className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
                <div
                    className="absolute h-4 w-4 rounded-full border border-primary/50 bg-background shadow -translate-y-0.5"
                    style={{ left: `${(hue / 360) * 100}%`, transform: 'translateX(-50%)' }}
                />
            </div>
        </div>
    )
}

// Alpha slider component
export const ColorPickerAlpha = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const { alpha, setAlpha, hue, saturation, lightness } = useColorPicker()
    const [isDragging, setIsDragging] = useState(false)
    const sliderRef = useRef<HTMLDivElement>(null)

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            if (!isDragging || !sliderRef.current) return

            const rect = sliderRef.current.getBoundingClientRect()
            const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
            setAlpha(x * 100)
        },
        [isDragging, setAlpha]
    )

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('pointermove', handlePointerMove)
            window.addEventListener('pointerup', () => setIsDragging(false))
        }
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', () => setIsDragging(false))
        }
    }, [isDragging, handlePointerMove])

    const currentColor = hslToHex(hue, saturation, lightness)

    return (
        <div
            ref={sliderRef}
            className={cn_util('relative flex h-4 w-full touch-none cursor-pointer', className)}
            onPointerDown={(e) => {
                e.preventDefault()
                setIsDragging(true)
                handlePointerMove(e.nativeEvent)
            }}
            {...props}
        >
            <div
                className="relative my-0.5 h-3 w-full grow rounded-full"
                style={{
                    background: `linear-gradient(to right, transparent, ${currentColor}), url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")`,
                }}
            >
                <div
                    className="absolute h-4 w-4 rounded-full border border-primary/50 bg-background shadow -translate-y-0.5"
                    style={{ left: `${alpha}%`, transform: 'translateX(-50%)' }}
                />
            </div>
        </div>
    )
}


// Eye dropper component
export const ColorPickerEyeDropper = ({ className, ...props }: React.ComponentProps<typeof Button>) => {
    const { setHue, setSaturation, setLightness, setAlpha } = useColorPicker()

    const handleEyeDropper = async () => {
        try {
            // @ts-ignore - EyeDropper API is experimental
            const eyeDropper = new EyeDropper()
            const result = await eyeDropper.open()
            const [h, s, l] = hexToHsl(result.sRGBHex)
            setHue(h)
            setSaturation(s)
            setLightness(l)
            setAlpha(100)
        } catch (error) {
            console.error('EyeDropper failed:', error)
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleEyeDropper}
            className={cn_util('shrink-0 text-muted-foreground', className)}
            {...props}
        >
            <PipetteIcon size={16} />
        </Button>
    )
}

// Output format selector
export const ColorPickerOutput = ({ className, ...props }: React.ComponentProps<typeof SelectTrigger>) => {
    const { mode, setMode } = useColorPicker()
    const formats = ['hex', 'rgb', 'hsl']

    return (
        <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="h-8 w-[4.5rem] shrink-0 text-xs" {...props}>
                <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
                {formats.map((format) => (
                    <SelectItem key={format} value={format} className="text-xs">
                        {format.toUpperCase()}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

// Format input component
export const ColorPickerFormat = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const { hue, saturation, lightness, alpha, mode, setHue, setSaturation, setLightness, setAlpha } = useColorPicker()

    const handleHexChange = (value: string) => {
        try {
            if (/^#[0-9A-F]{6}$/i.test(value)) {
                const [h, s, l] = hexToHsl(value)
                setHue(h)
                setSaturation(s)
                setLightness(l)
            }
        } catch (error) {
            console.error('Invalid hex color:', error)
        }
    }

    if (mode === 'hex') {
        const hex = hslToHex(hue, saturation, lightness)
        return (
            <div className={cn_util('flex items-center gap-1', className)} {...props}>
                <Input
                    type="text"
                    value={hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="h-8 flex-1 text-xs"
                />
                <Input
                    type="text"
                    value={Math.round(alpha)}
                    onChange={(e) => setAlpha(Number(e.target.value) || 0)}
                    className="h-8 w-16 text-xs"
                    placeholder="%"
                />
            </div>
        )
    }

    if (mode === 'rgb') {
        // Convert HSL to RGB for display
        const hex = hslToHex(hue, saturation, lightness)
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)

        return (
            <div className={cn_util('flex items-center gap-1', className)} {...props}>
                <Input type="text" value={r} readOnly className="h-8 w-16 text-xs" />
                <Input type="text" value={g} readOnly className="h-8 w-16 text-xs" />
                <Input type="text" value={b} readOnly className="h-8 w-16 text-xs" />
                <Input
                    type="text"
                    value={Math.round(alpha)}
                    onChange={(e) => setAlpha(Number(e.target.value) || 0)}
                    className="h-8 w-16 text-xs"
                />
            </div>
        )
    }

    if (mode === 'hsl') {
        return (
            <div className={cn_util('flex items-center gap-1', className)} {...props}>
                <Input
                    type="text"
                    value={Math.round(hue)}
                    onChange={(e) => setHue(Number(e.target.value) || 0)}
                    className="h-8 w-16 text-xs"
                />
                <Input
                    type="text"
                    value={Math.round(saturation)}
                    onChange={(e) => setSaturation(Number(e.target.value) || 0)}
                    className="h-8 w-16 text-xs"
                />
                <Input
                    type="text"
                    value={Math.round(lightness)}
                    onChange={(e) => setLightness(Number(e.target.value) || 0)}
                    className="h-8 w-16 text-xs"
                />
                <Input
                    type="text"
                    value={Math.round(alpha)}
                    onChange={(e) => setAlpha(Number(e.target.value) || 0)}
                    className="h-8 w-16 text-xs"
                />
            </div>
        )
    }

    return null
}

// Demo component
const ColorPickerDemo = () => {
    const [selectedColor, setSelectedColor] = useState('#3b82f6')

    return (
        <div className="flex flex-col items-center gap-6 p-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Color Picker</h2>
                <p className="text-muted-foreground">Select and customize colors with precision</p>
            </div>

            <div className="flex items-center gap-4">
                <div
                    className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                    style={{ backgroundColor: selectedColor }}
                />
                <div className="text-sm">
                    <div className="font-medium">Selected Color</div>
                    <div className="text-muted-foreground font-mono">{selectedColor}</div>
                </div>
            </div>

            <ColorPicker
                value={selectedColor}
                onChange={setSelectedColor}
                className="w-full max-w-[300px] rounded-md border bg-background p-4 shadow-sm"
            />
        </div>
    )
}

export default ColorPickerDemo
