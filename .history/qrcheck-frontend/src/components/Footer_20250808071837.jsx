const Footer = () => {
  return (
    <footer className="bg-green-900 text-white p-6 z-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/*div que ficarão as logos (LEDS, IFES INCUBADORA, ETC...) NÃO APAGAR!!! */}
          
        </div>
        <div className="mt-6 pt-6 border-t border-green-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} QRCheck. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;