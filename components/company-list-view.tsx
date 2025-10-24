import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, BriefcaseBusiness, Bell } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  logo: string
  lastActivity: string
  activeRoles: number
  notifications: number
}

interface CompanyListViewProps {
  companies: Company[]
  searchTerm: string
}

export function CompanyListView({ companies, searchTerm }: CompanyListViewProps) {
  // Filter companies based on search term
  const filteredCompanies = companies.filter((company) => company.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Color palette system for company cards
  const getCompanyColorPalette = (company: Company) => {
    if (company.notifications > 0) {
      return {
        card: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100",
        accent: "text-purple-600",
        badge: "bg-purple-100 text-purple-700 border-purple-200"
      }
    }
    if (company.activeRoles >= 4) {
      return {
        card: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100",
        accent: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200"
      }
    }
    if (company.activeRoles >= 2) {
      return {
        card: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100",
        accent: "text-blue-600",
        badge: "bg-blue-100 text-blue-700 border-blue-200"
      }
    }
    // Default palette
    return {
      card: "bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100",
      accent: "text-slate-600",
      badge: "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-4">
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No companies found</h3>
          <p className="text-muted-foreground">Try adjusting your search</p>
        </div>
      ) : (
        filteredCompanies.map((company) => {
          const colorPalette = getCompanyColorPalette(company)
          return (
          <Link href={`/clients/${company.id}`} key={company.id}>
            <Card className={`cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 shadow-sm ${colorPalette.card}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={company.logo} alt={company.name} />
                      <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${colorPalette.accent}`}>{company.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Last activity: {company.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <BriefcaseBusiness className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="font-medium">{company.activeRoles}</span>
                      <span className="ml-1 text-muted-foreground">active roles</span>
                    </div>
                    {company.notifications > 0 && (
                      <div className="flex items-center">
                        <Bell className={`h-5 w-5 mr-2 ${colorPalette.accent}`} />
                        <Badge className={`font-medium ${colorPalette.badge}`}>
                          {company.notifications} updates
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          )
        })
      )}
    </div>
  )
}
