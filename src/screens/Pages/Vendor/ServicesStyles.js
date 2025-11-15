// ServicesStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
    color: '#2C3E50',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  scrollWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
    height: 50,
  },
  horizontalScroll: {
    paddingHorizontal: 5,
  },
  leftArrow: {
    padding: 0,
    zIndex: 1,
  },
  rightArrow: {
    padding: 0,
    zIndex: 1,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 5,
    height: 40,
    justifyContent: 'center',
  },
  selectedCategory: {
    backgroundColor: '#2F4EAA',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  selectedCategoryText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  serviceButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 5,
    minWidth: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedService: {
    backgroundColor: '#2F4EAA',
  },
  serviceText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  selectedServiceText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  noItemsText: {
    textAlign: 'center',
    color: '#999',
    padding: 10,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 20,
    color: '#2C3E50',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: '#34495E',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D6E7F7',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#F8F9FA',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  addButton: {
    backgroundColor: '#2F4EAA',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  formScrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
});