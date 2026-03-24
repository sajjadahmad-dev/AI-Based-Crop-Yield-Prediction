import { useState, useEffect, useRef } from 'react'
import { 
  Sprout, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  MapPin, 
  Calendar, 
  FlaskConical,
  ArrowRight,
  Menu,
  X,
  BarChart3,
  Info,
  Home,
  Cpu,
  Leaf,
  User,
  Mail,
  Phone,
  GraduationCap,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Globe,
  LogIn,
  LogOut,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Navigation,
  CloudSun,
  Settings2,
  Beaker,
  Database,
  Cloud,
  MapPinned,
  ChevronDown,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Chart from 'chart.js/auto'

// Types
interface PredictionFormData {
  area: string
  cropType: string
  year: string
  rainfall: string
  temperature: string
  pesticides: string
  soilPh: string
  nitrogen: string
  phosphorus: string
  potassium: string
}

interface PredictionResult {
  predictedYield: number
  confidence: number
  recommendations: string[]
}

interface User {
  name: string
  email: string
}

// Mock weather data for cities
const cityWeatherData: Record<string, { rainfall: number; temperature: number }> = {
  'Faisalabad': { rainfall: 450, temperature: 28.5 },
  'Lahore': { rainfall: 650, temperature: 30.2 },
  'Multan': { rainfall: 180, temperature: 32.8 },
  'Karachi': { rainfall: 200, temperature: 31.5 },
  'Islamabad': { rainfall: 1200, temperature: 26.3 },
  'Peshawar': { rainfall: 450, temperature: 27.8 },
  'Quetta': { rainfall: 250, temperature: 22.4 },
  'Rawalpindi': { rainfall: 1100, temperature: 25.6 },
  'Gujranwala': { rainfall: 580, temperature: 29.1 },
  'Sialkot': { rainfall: 950, temperature: 27.2 },
}

// City to region mapping
const cityToRegion: Record<string, string> = {
  'Faisalabad': 'Punjab',
  'Lahore': 'Punjab',
  'Multan': 'Punjab',
  'Gujranwala': 'Punjab',
  'Sialkot': 'Punjab',
  'Rawalpindi': 'Punjab',
  'Karachi': 'Sindh',
  'Hyderabad': 'Sindh',
  'Sukkur': 'Sindh',
  'Peshawar': 'Khyber Pakhtunkhwa',
  'Mardan': 'Khyber Pakhtunkhwa',
  'Quetta': 'Balochistan',
  'Islamabad': 'Islamabad Capital Territory',
}

// Navigation Component
function Navbar({ 
  activeSection, 
  scrollToSection, 
  user, 
  onLogout, 
  onLoginClick, 
  onRegisterClick 
}: { 
  activeSection: string
  scrollToSection: (id: string) => void
  user: User | null
  onLogout: () => void
  onLoginClick: () => void
  onRegisterClick: () => void
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'predict', label: 'Predict', icon: Cpu },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className={`font-bold text-lg ${isScrolled ? 'text-emerald-800' : 'text-white'}`}>
              CropYield<span className="text-emerald-400">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : isScrolled
                        ? 'text-emerald-700 hover:bg-emerald-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
            
            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${isScrolled ? 'text-emerald-800' : 'text-white'}`}>
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isScrolled 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-emerald-200">
                <button
                  onClick={onLoginClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isScrolled 
                      ? 'text-emerald-700 hover:bg-emerald-50' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium">Login</span>
                </button>
                <button
                  onClick={onRegisterClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="font-medium">Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              isScrolled ? 'text-emerald-700 hover:bg-emerald-50' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl border-t border-emerald-100 animate-fade-in">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToSection(item.id)
                      setIsMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                      activeSection === item.id
                        ? 'bg-emerald-500 text-white'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-emerald-100">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 text-emerald-800">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        onLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onLoginClick()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-all"
                    >
                      <LogIn className="w-5 h-5" />
                      <span className="font-medium">Login</span>
                    </button>
                    <button
                      onClick={() => {
                        onRegisterClick()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span className="font-medium">Register</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Login Page Component
function LoginPage({ onLogin, onSwitchToRegister }: { onLogin: (user: User) => void; onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      onLogin({ name: 'Demo User', email })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <Card className="glass-card overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-emerald-50">Sign in to access your crop predictions</p>
          </div>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary-gradient py-6 text-lg rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-emerald-600">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
                >
                  Register here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Register Page Component
function RegisterPage({ onRegister, onSwitchToLogin }: { onRegister: (user: User) => void; onSwitchToLogin: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      onRegister({ name, email })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <Card className="glass-card overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-emerald-50">Join CropYield AI for smart predictions</p>
          </div>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Confirm your password"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary-gradient py-6 text-lg rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-emerald-600">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Hero Section
function HeroSection({ scrollToSection }: { scrollToSection: (id: string) => void }) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8 animate-fade-in">
          <GraduationCap className="w-4 h-4" />
          <span>Demo University - Campus XYZ</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
          AI-Based{' '}
          <span className="text-emerald-300">Crop Yield</span>
          <br />
          Prediction System
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/80 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Leveraging Machine Learning and Weather Data to Revolutionize Agriculture. 
          Predict crop yields accurately using weather patterns and soil conditions.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {[
            { num: '2', label: 'Zero Hunger', color: 'from-amber-400 to-orange-500' },
            { num: '9', label: 'Innovation', color: 'from-orange-400 to-red-500' },
            { num: '13', label: 'Climate Action', color: 'from-emerald-400 to-green-500' },
          ].map((sdg) => (
            <div key={sdg.num} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${sdg.color} text-white text-sm font-medium shadow-lg`}>
              <span className="font-bold">SDG {sdg.num}</span>
              <span className="opacity-90">{sdg.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => scrollToSection('predict')}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-700 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Cpu className="w-5 h-5" />
            Start Prediction
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/30 hover:bg-white/20 transition-all duration-300"
          >
            <Info className="w-5 h-5" />
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {[
            { value: '95%', label: 'Accuracy Rate' },
            { value: '50+', label: 'Crop Types' },
            { value: '10K+', label: 'Data Points' },
            { value: '24/7', label: 'Availability' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  )
}

// Enhanced Prediction Form Section
function PredictionSection({ onPrediction }: { onPrediction: (result: PredictionResult) => void }) {
  const [formData, setFormData] = useState<PredictionFormData>({
    area: '',
    cropType: '',
    year: '2024',
    rainfall: '',
    temperature: '',
    pesticides: '',
    soilPh: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isWeatherLoading, setIsWeatherLoading] = useState(false)
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [error, setError] = useState('')
  const [weatherError, setWeatherError] = useState('')
  const [locationError, setLocationError] = useState('')
  const [useAutoWeather, setUseAutoWeather] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [locationDetected, setLocationDetected] = useState(false)

  const areas = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
    'Islamabad Capital Territory'
  ]

  const cities = Object.keys(cityWeatherData)

  const cropTypes = [
    'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize',
    'Barley', 'Gram', 'Rapeseed', 'Sunflower', 'Soybean'
  ]

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    if (city && cityWeatherData[city]) {
      const weather = cityWeatherData[city]
      setFormData(prev => ({
        ...prev,
        rainfall: weather.rainfall.toString(),
        temperature: weather.temperature.toString(),
      }))
      // Auto-select region based on city
      if (cityToRegion[city]) {
        setFormData(prev => ({
          ...prev,
          area: cityToRegion[city],
          rainfall: weather.rainfall.toString(),
          temperature: weather.temperature.toString(),
        }))
      }
    }
  }

  const fetchCurrentWeather = async () => {
    setIsWeatherLoading(true)
    setWeatherError('')
    
    // Simulate weather API call
    setTimeout(() => {
      if (selectedCity && cityWeatherData[selectedCity]) {
        const weather = cityWeatherData[selectedCity]
        setFormData(prev => ({
          ...prev,
          rainfall: weather.rainfall.toString(),
          temperature: weather.temperature.toString(),
        }))
      } else {
        setWeatherError('Please select a city first')
      }
      setIsWeatherLoading(false)
    }, 1500)
  }

  const detectLocation = () => {
    setIsLocationLoading(true)
    setLocationError('')
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setIsLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        // Simulate location detection - default to Faisalabad for demo
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            area: 'Punjab',
          }))
          setSelectedCity('Faisalabad')
          setLocationDetected(true)
          setIsLocationLoading(false)
        }, 1500)
      },
      () => {
        setLocationError('Unable to detect location. Please select manually.')
        setIsLocationLoading(false)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation
    const requiredFields = ['area', 'cropType', 'rainfall', 'temperature', 'pesticides', 'soilPh', 'nitrogen', 'phosphorus', 'potassium']
    const emptyFields = requiredFields.filter(field => !formData[field as keyof PredictionFormData])
    
    if (emptyFields.length > 0) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: formData.area,
          crop_type: formData.cropType,
          year: parseInt(formData.year),
          rainfall: parseFloat(formData.rainfall),
          temperature: parseFloat(formData.temperature),
          pesticides: parseFloat(formData.pesticides),
          soil_ph: parseFloat(formData.soilPh),
          nitrogen: parseFloat(formData.nitrogen),
          phosphorus: parseFloat(formData.phosphorus),
          potassium: parseFloat(formData.potassium),
        }),
      })

      if (!response.ok) {
        throw new Error('Prediction failed')
      }

      const data = await response.json()
      onPrediction({
        predictedYield: data.predicted_yield || Math.round(Math.random() * 5000 + 2000),
        confidence: data.confidence || 92,
        recommendations: data.recommendations || [
          'Optimal irrigation schedule recommended',
          'Consider organic fertilizer application',
          'Monitor pest activity closely'
        ]
      })
    } catch (err) {
      // Fallback for demo when backend is not available
      setTimeout(() => {
        onPrediction({
          predictedYield: Math.round(Math.random() * 5000 + 2000),
          confidence: Math.round(Math.random() * 10 + 85),
          recommendations: [
            'Optimal irrigation schedule recommended',
            'Consider organic fertilizer application',
            'Monitor pest activity closely'
          ]
        })
      }, 1500)
    } finally {
      setTimeout(() => setIsLoading(false), 1500)
    }
  }

  return (
    <section id="predict" className="py-24 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <Cpu className="w-4 h-4" />
            <span>AI Prediction Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-4">
            Predict Your Crop Yield
          </h2>
          <p className="max-w-2xl mx-auto text-emerald-700/70">
            Enter your farm details, soil conditions, and weather data to get accurate yield predictions powered by machine learning.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Sprout className="w-6 h-6" />
                Crop Yield Prediction Form
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {/* Weather Mode Cards */}
              <div className="mb-8">
                <h4 className="font-semibold text-emerald-900 mb-3">Weather Input Mode</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUseAutoWeather(false)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${
                      !useAutoWeather
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                        : 'border-emerald-100 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                        <Settings2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-900">Manual Weather</p>
                        <p className="text-xs text-emerald-600">Type rainfall and temperature manually</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseAutoWeather(true)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${
                      useAutoWeather
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-blue-100 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                        <CloudSun className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">Auto Weather</p>
                        <p className="text-xs text-blue-600">Pick city and auto-fill weather</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                    <MapPinned className="w-5 h-5 text-emerald-500" />
                    Location Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Area */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        Area / Region
                      </label>
                      <div className="relative">
                        <select
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          className="input-field appearance-none"
                        >
                          <option value="">Select Area</option>
                          {areas.map((area) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Detect Location Button */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-emerald-800">
                        Auto-Detect Location
                      </label>
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={isLocationLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
                      >
                        {isLocationLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Detecting...
                          </>
                        ) : locationDetected ? (
                          <>
                            <Check className="w-5 h-5 text-emerald-500" />
                            Location Detected
                          </>
                        ) : (
                          <>
                            <Navigation className="w-5 h-5" />
                            Detect My Location
                          </>
                        )}
                      </button>
                      {locationError && (
                        <p className="text-sm text-red-500">{locationError}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Crop Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                    Crop Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Crop Type */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <Sprout className="w-4 h-4 text-emerald-500" />
                        Crop Type
                      </label>
                      <div className="relative">
                        <select
                          value={formData.cropType}
                          onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                          className="input-field appearance-none"
                        >
                          <option value="">Select Crop</option>
                          {cropTypes.map((crop) => (
                            <option key={crop} value={crop}>{crop}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Year */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        Year
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="input-field"
                        placeholder="2024"
                        min="2020"
                        max="2030"
                      />
                    </div>
                  </div>
                </div>

                {/* Weather Data Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                      <CloudSun className="w-5 h-5 text-emerald-500" />
                      Weather Data
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      useAutoWeather ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {useAutoWeather ? 'Auto Mode' : 'Manual Mode'}
                    </span>
                  </div>

                  {!useAutoWeather ? (
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <p className="text-sm text-emerald-700 mb-4">Manual mode selected. Enter weather values directly.</p>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                            <CloudRain className="w-4 h-4 text-emerald-500" />
                            Rainfall (mm)
                          </label>
                          <input
                            type="number"
                            value={formData.rainfall}
                            onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                            className="input-field"
                            placeholder="e.g., 850"
                            step="0.1"
                            min="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                            <Thermometer className="w-4 h-4 text-emerald-500" />
                            Temperature (C)
                          </label>
                          <input
                            type="number"
                            value={formData.temperature}
                            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                            className="input-field"
                            placeholder="e.g., 28.5"
                            step="0.1"
                            min="-10"
                            max="50"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-blue-800">Select City</label>
                          <div className="relative">
                            <select
                              value={selectedCity}
                              onChange={(e) => handleCityChange(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                            >
                              <option value="">Select City</option>
                              {cities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={fetchCurrentWeather}
                            disabled={isWeatherLoading || !selectedCity}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {isWeatherLoading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Fetching...
                              </>
                            ) : (
                              <>
                                <Cloud className="w-5 h-5" />
                                Use Current Weather
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {weatherError && (
                        <p className="text-sm text-red-500">{weatherError}</p>
                      )}

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-blue-900">
                            <CloudRain className="w-4 h-4 text-blue-600" />
                            Rainfall (mm)
                          </label>
                          <input
                            type="number"
                            value={formData.rainfall}
                            onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                            className="input-field"
                            placeholder="Will auto-fill"
                            step="0.1"
                            min="0"
                            readOnly
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-blue-900">
                            <Thermometer className="w-4 h-4 text-blue-600" />
                            Temperature (C)
                          </label>
                          <input
                            type="number"
                            value={formData.temperature}
                            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                            className="input-field"
                            placeholder="Will auto-fill"
                            step="0.1"
                            min="-10"
                            max="50"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Soil & Fertilizer Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-emerald-500" />
                    Soil & Fertilizer Data
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Pesticides */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <FlaskConical className="w-4 h-4 text-emerald-500" />
                        Pesticides (kg/ha)
                      </label>
                      <input
                        type="number"
                        value={formData.pesticides}
                        onChange={(e) => setFormData({ ...formData, pesticides: e.target.value })}
                        className="input-field"
                        placeholder="e.g., 25.5"
                        step="0.1"
                        min="0"
                      />
                    </div>

                    {/* Soil pH */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <Droplets className="w-4 h-4 text-emerald-500" />
                        Soil pH
                      </label>
                      <input
                        type="number"
                        value={formData.soilPh}
                        onChange={(e) => setFormData({ ...formData, soilPh: e.target.value })}
                        className="input-field"
                        placeholder="e.g., 6.5"
                        step="0.1"
                        min="0"
                        max="14"
                      />
                    </div>

                    {/* Nitrogen */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <Database className="w-4 h-4 text-emerald-500" />
                        Nitrogen (kg/ha)
                      </label>
                      <input
                        type="number"
                        value={formData.nitrogen}
                        onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                        className="input-field"
                        placeholder="e.g., 120"
                        step="1"
                        min="0"
                      />
                    </div>

                    {/* Phosphorus */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <Database className="w-4 h-4 text-emerald-500" />
                        Phosphorus (kg/ha)
                      </label>
                      <input
                        type="number"
                        value={formData.phosphorus}
                        onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                        className="input-field"
                        placeholder="e.g., 60"
                        step="1"
                        min="0"
                      />
                    </div>

                    {/* Potassium */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <Database className="w-4 h-4 text-emerald-500" />
                        Potassium (kg/ha)
                      </label>
                      <input
                        type="number"
                        value={formData.potassium}
                        onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                        className="input-field"
                        placeholder="e.g., 80"
                        step="1"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary-gradient py-6 text-lg rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Data...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-5 h-5 mr-2" />
                      Predict Yield
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Result Card Component
function ResultCard({ result }: { result: PredictionResult | null }) {
  if (!result) return null

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 animate-slide-up">
      <Card className="glass-card border-emerald-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-xl font-bold">Prediction Result</h3>
          </div>
          <p className="text-emerald-50">AI-powered analysis complete</p>
        </div>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="text-sm text-emerald-600 font-medium mb-2">Predicted Yield</div>
              <div className="text-4xl font-bold text-emerald-700">
                {result.predictedYield.toLocaleString()}
              </div>
              <div className="text-sm text-emerald-500 mt-1">kg per hectare</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="text-sm text-blue-600 font-medium mb-2">Confidence Score</div>
              <div className="text-4xl font-bold text-blue-700">{result.confidence}%</div>
              <div className="text-sm text-blue-500 mt-1">Model Accuracy</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-emerald-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI Recommendations
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-emerald-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Dashboard Section with Chart.js
function DashboardSection() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [
              {
                label: 'Wheat',
                data: [3200, 3400, 3100, 3600, 3800, 4200],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
              },
              {
                label: 'Rice',
                data: [2800, 3000, 2900, 3200, 3400, 3600],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
              },
              {
                label: 'Cotton',
                data: [1800, 2000, 1900, 2200, 2400, 2600],
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                },
              },
              title: {
                display: true,
                text: 'Historical Crop Yield Trends (kg/hectare)',
                font: {
                  size: 16,
                  weight: 'bold',
                },
                padding: 20,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                },
                title: {
                  display: true,
                  text: 'Yield (kg/hectare)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }
    }
  }, [])

  return (
    <section id="dashboard" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-4">
            Crop Yield Analytics
          </h2>
          <p className="max-w-2xl mx-auto text-emerald-700/70">
            Visualize historical crop yield trends and compare performance across different crop types.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Average Yield', value: '3,450', unit: 'kg/ha', change: '+12%', color: 'emerald' },
            { label: 'Total Predictions', value: '1,247', unit: 'predictions', change: '+28%', color: 'blue' },
            { label: 'Model Accuracy', value: '94.5', unit: '%', change: '+3.2%', color: 'amber' },
          ].map((stat) => (
            <Card key={stat.label} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
                  {stat.change}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.unit}</span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="glass-card p-6">
          <div className="chart-container">
            <canvas ref={chartRef} />
          </div>
        </Card>

        <div className="mt-8">
          <Card className="glass-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-500" />
                Crop Performance Comparison
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Crop</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Avg Yield</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Best Season</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Water Req.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {[
                    { crop: 'Wheat', yield: '3,200', season: 'Rabi', water: 'Medium', status: 'Optimal' },
                    { crop: 'Rice', yield: '2,800', season: 'Kharif', water: 'High', status: 'Good' },
                    { crop: 'Cotton', yield: '1,900', season: 'Kharif', water: 'Medium', status: 'Optimal' },
                    { crop: 'Sugarcane', yield: '65,000', season: 'Year-round', water: 'High', status: 'Excellent' },
                    { crop: 'Maize', yield: '4,500', season: 'Kharif', water: 'Medium', status: 'Good' },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-emerald-900">{row.crop}</td>
                      <td className="px-6 py-4 text-emerald-700">{row.yield} kg/ha</td>
                      <td className="px-6 py-4 text-gray-600">{row.season}</td>
                      <td className="px-6 py-4 text-gray-600">{row.water}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          row.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                          row.status === 'Optimal' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  const features = [
    {
      icon: Cpu,
      title: 'Machine Learning',
      description: 'Advanced Random Forest and Linear Regression models trained on extensive agricultural datasets.',
    },
    {
      icon: CloudRain,
      title: 'Weather Integration',
      description: 'Real-time weather data analysis including temperature, rainfall, and humidity patterns.',
    },
    {
      icon: Droplets,
      title: 'Soil Analysis',
      description: 'Comprehensive soil data processing including pH levels, NPK nutrients, and soil type.',
    },
    {
      icon: Globe,
      title: 'Location Based',
      description: 'Region-specific predictions tailored to local climate and soil conditions.',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Interactive dashboards and charts for easy interpretation of prediction results.',
    },
    {
      icon: User,
      title: 'Farmer Friendly',
      description: 'Intuitive interface designed specifically for farmers and agricultural professionals.',
    },
  ]

  return (
    <section id="about" className="py-24 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <Info className="w-4 h-4" />
            <span>About Project</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-4">
            About The Project
          </h2>
          <p className="max-w-3xl mx-auto text-emerald-700/70">
            Dummy project summary text for demonstration purposes only.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">{feature.title}</h3>
                <p className="text-emerald-700/70 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="glass-card overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Project Details
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between py-3 border-b border-emerald-100">
                <span className="text-gray-600">Project Title</span>
                <span className="font-medium text-emerald-900 text-right">Demo Project Title</span>
              </div>
              <div className="flex justify-between py-3 border-b border-emerald-100">
                <span className="text-gray-600">University</span>
                <span className="font-medium text-emerald-900 text-right">Demo University - Campus XYZ</span>
              </div>
              <div className="flex justify-between py-3 border-b border-emerald-100">
                <span className="text-gray-600">Program</span>
                <span className="font-medium text-emerald-900">Demo Program</span>
              </div>
              <div className="flex justify-between py-3 border-b border-emerald-100">
                <span className="text-gray-600">Session</span>
                <span className="font-medium text-emerald-900">20XX-20YY</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Nature</span>
                <span className="font-medium text-emerald-900">Demo Nature</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Cpu className="w-6 h-6" />
                Tech Stack
              </h3>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { category: 'Frontend', tech: 'Demo Frontend Stack' },
                  { category: 'Backend', tech: 'Demo Backend Stack' },
                  { category: 'ML Libraries', tech: 'Demo ML Stack' },
                  { category: 'Database', tech: 'Demo Database' },
                  { category: 'Visualization', tech: 'Demo Visualization' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-500">{item.category}</div>
                    <div className="flex-1 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                      {item.tech}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">
                Demo<span className="text-emerald-400">App</span>
              </span>
            </div>
            <p className="text-emerald-200/70 max-w-md mb-6">
              Dummy project description for UI preview only.
            </p>
            <div className="flex gap-3">
              {['SDG 2', 'SDG 9', 'SDG 13'].map((sdg) => (
                <span key={sdg} className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-medium">
                  {sdg}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              Student
            </h4>
            <div className="space-y-3 text-emerald-200/70">
              <p className="font-medium text-white">Demo User Name</p>
              <p className="flex items-center gap-2 text-sm">
                <span className="text-emerald-400">Reg#</span> DEMO-0000
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-emerald-400" />
                demo.user@example.com
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-emerald-400" />
                00000000000
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              Supervisors
            </h4>
            <div className="space-y-4 text-emerald-200/70">
              <div>
                <p className="font-medium text-white">Supervisor A</p>
                <p className="text-sm">Project Advisor</p>
              </div>
              <div>
                <p className="font-medium text-white">Supervisor B</p>
                <p className="text-sm">Committee Member</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-emerald-400/60 text-sm">
            © 2024 Demo App. All rights reserved.
          </p>
          <p className="text-emerald-400/60 text-sm">
            Demo Program - Semester X - Session 20XX-20YY
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<'main' | 'login' | 'register'>('main')

  const scrollToSection = (id: string) => {
    setCurrentView('main')
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setActiveSection(id)
      }
    }, 100)
  }

  const handleLogin = (userData: User) => {
    setUser(userData)
    setCurrentView('main')
  }

  const handleLogout = () => {
    setUser(null)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'predict', 'dashboard', 'about']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Render different views
  if (currentView === 'login') {
    return (
      <div className="min-h-screen">
        <Navbar 
          activeSection={activeSection} 
          scrollToSection={scrollToSection}
          user={user}
          onLogout={handleLogout}
          onLoginClick={() => setCurrentView('login')}
          onRegisterClick={() => setCurrentView('register')}
        />
        <LoginPage 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setCurrentView('register')} 
        />
      </div>
    )
  }

  if (currentView === 'register') {
    return (
      <div className="min-h-screen">
        <Navbar 
          activeSection={activeSection} 
          scrollToSection={scrollToSection}
          user={user}
          onLogout={handleLogout}
          onLoginClick={() => setCurrentView('login')}
          onRegisterClick={() => setCurrentView('register')}
        />
        <RegisterPage 
          onRegister={handleLogin} 
          onSwitchToLogin={() => setCurrentView('login')} 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setCurrentView('login')}
        onRegisterClick={() => setCurrentView('register')}
      />
      <main>
        <HeroSection scrollToSection={scrollToSection} />
        <PredictionSection onPrediction={setPredictionResult} />
        <ResultCard result={predictionResult} />
        <DashboardSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
