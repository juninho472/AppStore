import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: string) => void;
}

const Header = ({
  onSearch = () => console.log("Search triggered"),
  onFilterChange = () => console.log("Filter changed"),
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-20 bg-white border-b border-[#E5DDD3] px-4 md:px-6 lg:px-8 flex items-center justify-between shadow-sm"
    >
      <div className="flex items-center gap-8">
        <div className="text-2xl font-serif font-bold text-[#1B365D]">
          App Store
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 max-w-md flex-1"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8685] h-4 w-4" />
            <Input
              type="search"
              placeholder="Search apps..."
              className="pl-10 w-full border-[#E5DDD3] bg-[#F5F0EA] placeholder-[#8B8685] focus:border-[#1B365D] transition-colors duration-200 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-[#E5DDD3] hover:border-[#1B365D] hover:bg-[#F5F0EA] transition-colors duration-200"
              >
                <Filter className="h-4 w-4 text-[#1B365D]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-[#E5DDD3] shadow-lg rounded-lg"
            >
              <DropdownMenuItem
                onClick={() => onFilterChange("category")}
                className="hover:bg-[#F5F0EA] text-[#4A4645] focus:text-[#1B365D] cursor-pointer"
              >
                Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilterChange("rating")}
                className="hover:bg-[#F5F0EA] text-[#4A4645] focus:text-[#1B365D] cursor-pointer"
              >
                Rating
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilterChange("date")}
                className="hover:bg-[#F5F0EA] text-[#4A4645] focus:text-[#1B365D] cursor-pointer"
              >
                Date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </form>
      </div>

      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#F5F0EA] text-[#1B365D]"
          onClick={() => console.log("Mobile search")}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;
